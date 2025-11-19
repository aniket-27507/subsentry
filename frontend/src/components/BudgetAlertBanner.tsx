import { BudgetAlert, BudgetStatus } from '../types';
import { AlertTriangle, Bell } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../utils/format';

interface BudgetAlertBannerProps {
  alert: BudgetAlert;
  budgetStatus: BudgetStatus;
  currency: string;
  onDismiss: () => void;
  onViewBudget: () => void;
}

export default function BudgetAlertBanner({
  alert,
  budgetStatus,
  currency,
  onDismiss,
  onViewBudget,
}: BudgetAlertBannerProps) {
  if (alert === 'none') return null;

  const isExceeded = alert === 'exceeded';
  const icon = isExceeded ? <AlertTriangle size={20} /> : <Bell size={20} />;
  const title = isExceeded ? 'Budget exceeded' : 'Budget warning';
  const message = isExceeded
    ? 'You have exceeded your budget. Review and adjust your subscriptions.'
    : 'You are approaching your budget limit. Keep an eye on upcoming renewals.';

  return (
    <div
      className={`mb-6 rounded-xl border p-4 flex flex-wrap items-center gap-4 ${
        isExceeded
          ? 'bg-danger/10 border-danger/30 text-danger dark:bg-danger-dark/15 dark:border-danger-dark/40 dark:text-danger-dark'
          : 'bg-warning/10 border-warning/30 text-warning dark:bg-warning-dark/15 dark:border-warning-dark/40 dark:text-warning-dark'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-80">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm flex-1">
        <div>
          <p className="uppercase text-xs opacity-70 mb-1">Monthly</p>
          <p className="font-semibold">
            {formatCurrency(budgetStatus.monthlySpent, currency)} /{' '}
            {formatCurrency(budgetStatus.monthlyBudget, currency)}
          </p>
        </div>
        <div>
          <p className="uppercase text-xs opacity-70 mb-1">Annual</p>
          <p className="font-semibold">
            {formatCurrency(budgetStatus.annualSpent, currency)} /{' '}
            {formatCurrency(budgetStatus.annualBudget, currency)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
        <Button size="sm" onClick={onViewBudget}>
          View Budget
        </Button>
      </div>
    </div>
  );
}

