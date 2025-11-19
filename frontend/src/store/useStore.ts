import { create } from 'zustand';
import {
  Subscription,
  SubscriptionDraft,
  SubscriptionTemplate,
  RecentSubscriptionDraft,
  QuickAddSource,
  Category,
  User,
  DashboardMetrics,
  CategorySpend,
  MonthlySpend,
  UpcomingRenewal,
  BulkOperationResult,
  FilterConfig,
  SortConfig,
  Budget,
  BudgetStatus,
  BudgetAlert,
  SubscriptionStatus,
} from '../types';
import { mockSubscriptions, mockUser, subscriptionTemplates } from './mockData';
import { calculateBudgetStatus } from '../utils/budget';

const getMonthlyAmount = (sub: Subscription) =>
  sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;

const RECENT_SUBSCRIPTIONS_KEY = 'subsentry_recent_subscriptions';
const RECENT_SUBSCRIPTIONS_LIMIT = 6;

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadRecentDrafts = (): RecentSubscriptionDraft[] => {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(RECENT_SUBSCRIPTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is RecentSubscriptionDraft =>
          entry &&
          typeof entry.id === 'string' &&
          typeof entry.name === 'string' &&
          typeof entry.usedAt === 'string' &&
          entry.draft &&
          typeof entry.draft.name === 'string'
      )
      .slice(0, RECENT_SUBSCRIPTIONS_LIMIT);
  } catch {
    return [];
  }
};

const persistRecentDrafts = (drafts: RecentSubscriptionDraft[]) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(RECENT_SUBSCRIPTIONS_KEY, JSON.stringify(drafts));
  } catch {
    // ignore write failures (private/incognito mode)
  }
};

interface AppState {
  user: User | null;
  subscriptions: Subscription[];
  subscriptionTemplates: SubscriptionTemplate[];
  recentSubscriptions: RecentSubscriptionDraft[];
  subscriptionDraft: SubscriptionDraft | null;
  subscriptionDraftSource: QuickAddSource;
  isAuthenticated: boolean;
  budget: Budget | null;
  markTutorialCompletion: (completed: boolean) => void;
  setSubscriptionDraft: (draft: SubscriptionDraft | null, source?: QuickAddSource) => void;
  clearSubscriptionDraft: () => void;
  buildDraftFromTemplate: (templateId: string) => SubscriptionDraft | null;
  buildDraftFromSubscription: (id: string) => SubscriptionDraft | null;
  recordRecentSubscription: (draft: SubscriptionDraft, source: QuickAddSource) => void;

  // Actions
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (email: string, password: string, name: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Subscription actions
  addSubscription: (
    subscription: SubscriptionDraft,
    options?: { source?: QuickAddSource }
  ) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
  bulkDeleteSubscriptions: (ids: string[]) => BulkOperationResult;
  bulkCancelSubscriptions: (ids: string[]) => BulkOperationResult;
  bulkToggleReminders: (ids: string[], enabled: boolean) => BulkOperationResult;
  bulkUpdateSubscriptions: (ids: string[], updates: Partial<Subscription>) => BulkOperationResult;
  filterSubscriptions: (subscriptions: Subscription[], config: FilterConfig) => Subscription[];
  sortSubscriptions: (subscriptions: Subscription[], config: SortConfig) => Subscription[];

  // Computed metrics
  getDashboardMetrics: () => DashboardMetrics;
  getCategorySpend: () => CategorySpend[];
  getMonthlySpendTrend: () => MonthlySpend[];
  getUpcomingRenewals: (days: number) => UpcomingRenewal[];
  getTopExpensiveSubscriptions: (limit: number) => Subscription[];
  getBudgetStatus: () => BudgetStatus;
  checkBudgetAlerts: () => BudgetAlert;

  // Budget actions
  setBudget: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (updates: Partial<Budget>) => void;
  deleteBudget: () => void;

  // Data management
  importState: (data: Partial<AppState>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  subscriptions: [],
  subscriptionTemplates,
  recentSubscriptions: loadRecentDrafts(),
  subscriptionDraft: null,
  subscriptionDraftSource: 'manual',
  isAuthenticated: false,
  budget: null,
  markTutorialCompletion: (completed: boolean) => {
    set((state) => {
      if (!state.user) return {};
      return {
        user: { ...state.user, hasCompletedTutorial: completed },
      };
    });
  },
  setSubscriptionDraft: (draft, source = 'manual') => {
    set({
      subscriptionDraft: draft,
      subscriptionDraftSource: draft ? source : 'manual',
    });
  },
  clearSubscriptionDraft: () => {
    set({ subscriptionDraft: null, subscriptionDraftSource: 'manual' });
  },
  buildDraftFromTemplate: (templateId) => {
    const template = get().subscriptionTemplates.find((tpl) => tpl.id === templateId);
    const user = get().user;
    if (!template) return null;
    return {
      name: template.name,
      category: template.category,
      amount: template.suggestedAmount,
      currency: user?.currencyPreference || template.currency,
      billingCycle: template.defaultBillingCycle,
      firstPaymentDate: '',
      nextRenewalDate: '',
      paymentMethod: template.paymentMethod,
      notes: template.noteHint ?? '',
      status: 'active',
      reminderEnabled: true,
      reminderDaysBefore: user?.defaultReminderDays ?? 7,
    };
  },
  buildDraftFromSubscription: (id) => {
    const existing = get().getSubscriptionById(id);
    if (!existing) return null;
    const { id: _ignoreId, createdAt: _ignoreCreatedAt, updatedAt: _ignoreUpdatedAt, ...draft } =
      existing;
    void _ignoreId;
    void _ignoreCreatedAt;
    void _ignoreUpdatedAt;
    return draft;
  },
  recordRecentSubscription: (draft, source) => {
    set((state) => {
      const filtered = state.recentSubscriptions.filter(
        (recent) =>
          !(
            recent.draft.name.toLowerCase() === draft.name.toLowerCase() &&
            recent.draft.billingCycle === draft.billingCycle &&
            recent.draft.amount === draft.amount
          )
      );
      const nextRecent: RecentSubscriptionDraft = {
        id: `recent-${Date.now()}`,
        name: draft.name,
        category: draft.category,
        usedAt: new Date().toISOString(),
        source,
        draft: { ...draft },
      };
      const next = [nextRecent, ...filtered].slice(0, RECENT_SUBSCRIPTIONS_LIMIT);
      persistRecentDrafts(next);
      return { recentSubscriptions: next };
    });
  },

  login: (email: string, _password: string) => {
    void _password;
    const nextUser = { ...mockUser, email };
    set({
      user: nextUser,
      isAuthenticated: true,
      subscriptions: mockSubscriptions,
      budget: nextUser.budget ?? null,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      subscriptions: [],
      budget: null,
      subscriptionDraft: null,
      subscriptionDraftSource: 'manual',
    });
  },

  signup: (email: string, _password: string, name: string) => {
    void _password;
    const newUser: User = {
      ...mockUser,
      email,
      name,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      hasCompletedTutorial: false,
      budget: undefined,
    };
    set({
      user: newUser,
      isAuthenticated: true,
      subscriptions: [],
      budget: null,
      subscriptionDraft: null,
      subscriptionDraftSource: 'manual',
    });
  },

  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({
      user: state.user ? { ...state.user, theme } : null,
    }));
  },

  addSubscription: (subscriptionData, options) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      subscriptions: [...state.subscriptions, newSubscription],
    }));
    get().recordRecentSubscription(subscriptionData, options?.source ?? 'manual');
  },

  updateSubscription: (id, updates) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates, updatedAt: new Date().toISOString() } : sub
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

  bulkDeleteSubscriptions: (ids) => {
    const idSet = new Set(ids);
    const { subscriptions } = get();
    const beforeCount = subscriptions.length;
    const remaining = subscriptions.filter((sub) => !idSet.has(sub.id));
    const success = beforeCount - remaining.length;
    const failed = ids.length - success;

    set({ subscriptions: remaining });

    return {
      success,
      failed,
      errors: failed > 0 ? ['Some subscriptions could not be deleted'] : [],
    };
  },

  bulkCancelSubscriptions: (ids) => {
    const idSet = new Set(ids);
    const { subscriptions } = get();
    let success = 0;

    const updated = subscriptions.map((sub) => {
      if (idSet.has(sub.id) && sub.status !== 'cancelled') {
        success += 1;
        return {
          ...sub,
          status: 'cancelled' as SubscriptionStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return sub;
    });

    const failed = ids.length - success;
    set({ subscriptions: updated });

    return {
      success,
      failed,
      errors: failed > 0 ? ['Some subscriptions were already cancelled or not found'] : [],
    };
  },

  bulkToggleReminders: (ids, enabled) => {
    const idSet = new Set(ids);
    const { subscriptions } = get();
    let success = 0;

    const updated = subscriptions.map((sub) => {
      if (idSet.has(sub.id)) {
        success += 1;
        return {
          ...sub,
          reminderEnabled: enabled,
          updatedAt: new Date().toISOString(),
        };
      }
      return sub;
    });

    const failed = ids.length - success;
    set({ subscriptions: updated });

    return {
      success,
      failed,
      errors: failed > 0 ? ['Some subscriptions were not found'] : [],
    };
  },

  bulkUpdateSubscriptions: (ids, updates) => {
    const idSet = new Set(ids);
    const { subscriptions } = get();
    let success = 0;

    const updated = subscriptions.map((sub) => {
      if (idSet.has(sub.id)) {
        success += 1;
        return {
          ...sub,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return sub;
    });

    const failed = ids.length - success;
    set({ subscriptions: updated });

    return {
      success,
      failed,
      errors: failed > 0 ? ['Some subscriptions were not found'] : [],
    };
  },

  filterSubscriptions: (subscriptions, config) => {
    return subscriptions.filter((sub) => {
      const matchesSearch = config.searchQuery
        ? sub.name.toLowerCase().includes(config.searchQuery.toLowerCase())
        : true;

      const matchesCategory =
        config.categories.length === 0 || config.categories.includes(sub.category);

      const matchesCycle =
        config.billingCycles.length === 0 || config.billingCycles.includes(sub.billingCycle);

      const matchesStatus =
        config.statuses.length === 0 || config.statuses.includes(sub.status);

      const matchesPayment =
        config.paymentMethods.length === 0 || config.paymentMethods.includes(sub.paymentMethod);

      const monthlyAmount = getMonthlyAmount(sub);
      const matchesPriceMin =
        config.priceRange.min === null || monthlyAmount >= config.priceRange.min;
      const matchesPriceMax =
        config.priceRange.max === null || monthlyAmount <= config.priceRange.max;

      const matchesReminder =
        config.reminderEnabled === null || sub.reminderEnabled === config.reminderEnabled;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCycle &&
        matchesStatus &&
        matchesPayment &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesReminder
      );
    });
  },

  sortSubscriptions: (subscriptions, config) => {
    const sorted = [...subscriptions].sort((a, b) => {
      let comparison = 0;

      switch (config.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'monthlyAmount':
          comparison = getMonthlyAmount(a) - getMonthlyAmount(b);
          break;
        case 'nextRenewalDate':
          comparison =
            new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return config.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
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
      const monthlyAmount = getMonthlyAmount(sub);
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as Category,
      amount: Math.round(amount * 100) / 100,
      percentage: total ? Math.round((amount / total) * 100) : 0,
    }));
  },

  getMonthlySpendTrend: () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentMonth = new Date().getMonth();
    const { totalMonthlySpend } = get().getDashboardMetrics();

    return months
      .map((month) => {
        const variation = Math.random() * 0.2 - 0.1;
        const amount = totalMonthlySpend * (1 + variation);
        return {
          month,
          amount: Math.round(amount * 100) / 100,
        };
      })
      .slice(currentMonth - 11 < 0 ? 0 : currentMonth - 11, currentMonth + 1);
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
        const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
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
        monthlyAmount: getMonthlyAmount(sub),
      }))
      .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
      .slice(0, limit);
  },

  setBudget: (budgetData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const timestamp = new Date().toISOString();
    const newBudget: Budget = {
      ...budgetData,
      id: `budget-${Date.now()}`,
      userId: currentUser.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    set((state) => ({
      budget: newBudget,
      user: state.user ? { ...state.user, budget: newBudget } : null,
    }));
  },

  updateBudget: (updates) => {
    set((state) => {
      if (!state.budget) return {};
      const updatedBudget: Budget = {
        ...state.budget,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return {
        budget: updatedBudget,
        user: state.user ? { ...state.user, budget: updatedBudget } : null,
      };
    });
  },

  deleteBudget: () => {
    set((state) => ({
      budget: null,
      user: state.user ? { ...state.user, budget: undefined } : null,
    }));
  },

  getBudgetStatus: () => {
    const budget = get().budget;
    if (!budget) {
      return {
        monthlySpent: 0,
        monthlyBudget: 0,
        monthlyRemaining: 0,
        monthlyPercentage: 0,
        annualSpent: 0,
        annualBudget: 0,
        annualRemaining: 0,
        annualPercentage: 0,
        alert: 'none',
      };
    }

    const { totalMonthlySpend, totalAnnualSpend } = get().getDashboardMetrics();
    return calculateBudgetStatus(
      { monthly: totalMonthlySpend, annual: totalAnnualSpend },
      budget
    );
  },

  checkBudgetAlerts: () => {
    return get().getBudgetStatus().alert;
  },

  importState: (data) => {
    set((state) => ({
      user: data.user ? { ...state.user, ...data.user } : state.user,
      subscriptions: data.subscriptions || state.subscriptions,
      budget: data.budget || state.budget,
    }));
  },
}));
