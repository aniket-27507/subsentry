export type BillingCycle = 'monthly' | 'annual' | 'custom';
export type SubscriptionStatus = 'active' | 'cancelled';
export type Category = 'Streaming' | 'SaaS' | 'Fitness' | 'Utilities' | 'Other';
export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer' | 'Other';
export type QuickAddSource = 'manual' | 'template' | 'recent' | 'duplicate';

export type SortField =
  | 'name'
  | 'amount'
  | 'nextRenewalDate'
  | 'category'
  | 'createdAt'
  | 'monthlyAmount';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface FilterConfig {
  categories: Category[];
  billingCycles: BillingCycle[];
  statuses: SubscriptionStatus[];
  paymentMethods: PaymentMethod[];
  priceRange: PriceRange;
  reminderEnabled: boolean | null;
  searchQuery: string;
}

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

export type SubscriptionDraft = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;

export interface SubscriptionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: Category;
  defaultBillingCycle: BillingCycle;
  suggestedAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  noteHint?: string;
}

export interface RecentSubscriptionDraft {
  id: string;
  name: string;
  category: Category;
  usedAt: string;
  source: QuickAddSource;
  draft: SubscriptionDraft;
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
  budget?: Budget;
  hasCompletedTutorial?: boolean;
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

export type BulkAction =
  | 'delete'
  | 'cancel'
  | 'toggleReminders'
  | 'changeCategory'
  | 'changePaymentMethod';

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface Budget {
  id: string;
  userId: string;
  monthlyBudget: number;
  annualBudget: number;
  currency: string;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetAlert = 'none' | 'warning' | 'exceeded';

export interface BudgetStatus {
  monthlySpent: number;
  monthlyBudget: number;
  monthlyRemaining: number;
  monthlyPercentage: number;
  annualSpent: number;
  annualBudget: number;
  annualRemaining: number;
  annualPercentage: number;
  alert: BudgetAlert;
}

