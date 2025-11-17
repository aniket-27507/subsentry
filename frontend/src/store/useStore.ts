import { create } from 'zustand';
import {
  Subscription,
  User,
  DashboardMetrics,
  CategorySpend,
  MonthlySpend,
  UpcomingRenewal,
} from '../types';
import { mockSubscriptions, mockUser } from './mockData';

interface AppState {
  user: User | null;
  subscriptions: Subscription[];
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (email: string, password: string, name: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Subscription actions
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
  
  // Computed metrics
  getDashboardMetrics: () => DashboardMetrics;
  getCategorySpend: () => CategorySpend[];
  getMonthlySpendTrend: () => MonthlySpend[];
  getUpcomingRenewals: (days: number) => UpcomingRenewal[];
  getTopExpensiveSubscriptions: (limit: number) => Subscription[];
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  subscriptions: [],
  isAuthenticated: false,
  
  login: (email: string, _password: string) => {
    // Mock login - in real app, this would call an API
    set({
      user: { ...mockUser, email },
      isAuthenticated: true,
      subscriptions: mockSubscriptions,
    });
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      subscriptions: [],
    });
  },
  
  signup: (email: string, _password: string, name: string) => {
    // Mock signup - in real app, this would call an API
    const newUser: User = {
      ...mockUser,
      email,
      name,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set({
      user: newUser,
      isAuthenticated: true,
      subscriptions: [], // Start with empty subscriptions for new users
    });
  },
  
  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({
      user: state.user ? { ...state.user, theme } : null,
    }));
  },
  
  addSubscription: (subscriptionData) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      subscriptions: [...state.subscriptions, newSubscription],
    }));
  },
  
  updateSubscription: (id, updates) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      ),
    }));
  },
  
  deleteSubscription: (id) => {
    set((state) => ({
      subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
    }));
  },
  
  getSubscriptionById: (id) => {
    return get().subscriptions.find((sub) => sub.id === id);
  },
  
  getDashboardMetrics: () => {
    const { subscriptions } = get();
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
    
    const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === 'monthly') {
        return sum + sub.amount;
      } else if (sub.billingCycle === 'annual') {
        return sum + sub.amount / 12;
      }
      return sum;
    }, 0);
    
    const totalAnnualSpend = activeSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === 'monthly') {
        return sum + sub.amount * 12;
      } else if (sub.billingCycle === 'annual') {
        return sum + sub.amount;
      }
      return sum;
    }, 0);
    
    const upcomingRenewals = get().getUpcomingRenewals(30);
    
    return {
      totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
      totalAnnualSpend: Math.round(totalAnnualSpend * 100) / 100,
      activeSubscriptionsCount: activeSubscriptions.length,
      upcomingRenewalsCount: upcomingRenewals.length,
    };
  },
  
  getCategorySpend: () => {
    const { subscriptions } = get();
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
    
    const categoryTotals = activeSubscriptions.reduce((acc, sub) => {
      const monthlyAmount =
        sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as any,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((amount / total) * 100),
    }));
  },
  
  getMonthlySpendTrend: () => {
    // Mock data for the last 12 months
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentMonth = new Date().getMonth();
    const { totalMonthlySpend } = get().getDashboardMetrics();
    
    return months.map((month, index) => {
      // Simulate some variation in spending
      const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
      const amount = totalMonthlySpend * (1 + variation);
      return {
        month,
        amount: Math.round(amount * 100) / 100,
      };
    }).slice(currentMonth - 11 < 0 ? 0 : currentMonth - 11, currentMonth + 1);
  },
  
  getUpcomingRenewals: (days: number) => {
    const { subscriptions } = get();
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return subscriptions
      .filter((sub) => {
        if (sub.status !== 'active') return false;
        const renewalDate = new Date(sub.nextRenewalDate);
        return renewalDate >= now && renewalDate <= futureDate;
      })
      .map((sub) => {
        const renewalDate = new Date(sub.nextRenewalDate);
        const daysUntilRenewal = Math.ceil(
          (renewalDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
        );
        return {
          ...sub,
          daysUntilRenewal,
        };
      })
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
  },
  
  getTopExpensiveSubscriptions: (limit: number) => {
    const { subscriptions } = get();
    const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
    
    return activeSubscriptions
      .map((sub) => ({
        ...sub,
        monthlyAmount: sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12,
      }))
      .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
      .slice(0, limit);
  },
}));

