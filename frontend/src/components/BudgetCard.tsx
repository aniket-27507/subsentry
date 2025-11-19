import { BudgetStatus } from '../types';
import Button from './Button';
import Badge from './Badge';
import { formatCurrency } from '../utils/format';

interface BudgetCardProps {
  budgetStatus: BudgetStatus;
  currency: string;
  alertThreshold?: number;
  onEdit?: () => void;
}

const getProgressColor = (percentage: number, threshold = 80) => {
  if (percentage >= 100) return 'bg-danger';
  if (percentage >= threshold) return 'bg-warning';
  return 'bg-success';
};

export default function BudgetCard({
  budgetStatus,
  currency,
  alertThreshold = 80,
  onEdit,
}: BudgetCardProps) {
  const blocks = [
    {
      title: 'Monthly Budget',
      spent: budgetStatus.monthlySpent,
      budget: budgetStatus.monthlyBudget,
      percentage: budgetStatus.monthlyPercentage,
      remaining: budgetStatus.monthlyRemaining,
    },
    {
      title: 'Annual Budget',
      spent: budgetStatus.annualSpent,
      budget: budgetStatus.annualBudget,
      percentage: budgetStatus.annualPercentage,
      remaining: budgetStatus.annualRemaining,
    },
  ];

  return (
    <div className="p-6 border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Budget Overview</h2>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
            Track how close you are to your spending limits
          </p>
        </div>
        {onEdit && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            {budgetStatus.monthlyBudget > 0 || budgetStatus.annualBudget > 0 ? 'Edit Budget' : 'Set Budget'}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {blocks.map((block) => (
          <div key={block.title} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                  {block.title}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                  {formatCurrency(block.spent, currency)}{' '}
                  <span className="text-sm font-normal text-gray-500 dark:text-dark-text-secondary">
                    of {formatCurrency(block.budget, currency)}
                  </span>
                </p>
              </div>
              <Badge
                variant={
                  block.percentage >= 100
                    ? 'danger'
                    : block.percentage >= alertThreshold
                    ? 'warning'
                    : 'success'
                }
                size="sm"
              >
                {Math.min(Math.round(block.percentage), 999)}%
              </Badge>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-dark-border overflow-hidden">
              <div
                className={`${getProgressColor(block.percentage, alertThreshold)} h-full rounded-full transition-all`}
                style={{ width: `${Math.min(block.percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              Remaining:{' '}
              <span className="font-semibold text-gray-900 dark:text-dark-text">
                {formatCurrency(block.remaining, currency)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

