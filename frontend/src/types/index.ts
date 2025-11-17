export type BillingCycle = 'monthly' | 'annual' | 'custom';
export type SubscriptionStatus = 'active' | 'cancelled';
export type Category = 'Streaming' | 'SaaS' | 'Fitness' | 'Utilities' | 'Other';
export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer' | 'Other';

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  firstPaymentDate: string;
  nextRenewalDate: string;
  paymentMethod: PaymentMethod;
  notes: string;
  status: SubscriptionStatus;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  currencyPreference: string;
  timezone: string;
  defaultReminderDays: number;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface DashboardMetrics {
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  activeSubscriptionsCount: number;
  upcomingRenewalsCount: number;
}

export interface CategorySpend {
  category: Category;
  amount: number;
  percentage: number;
}

export interface MonthlySpend {
  month: string;
  amount: number;
}

export interface UpcomingRenewal extends Subscription {
  daysUntilRenewal: number;
}

