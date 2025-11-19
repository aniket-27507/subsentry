import { Bell, BellOff, CopyPlus, Edit3, Trash2 } from 'lucide-react';
import { Subscription } from '../types';
import { formatBillingCycle, formatCurrency, formatDate } from '../utils/format';
import Badge from './Badge';
import SwipeableRow from './SwipeableRow';
import Checkbox from './Checkbox';

interface MobileSubscriptionCardProps {
  subscription: Subscription;
  currency: string;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onView: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleReminder?: (id: string, enabled: boolean) => void;
  onToggleSelect?: (id: string) => void;
  isSelected?: boolean;
}

export default function MobileSubscriptionCard({
  subscription,
  currency,
  onEdit,
  onCancel,
  onView,
  onDuplicate,
  onToggleReminder,
  onToggleSelect,
  isSelected = false,
}: MobileSubscriptionCardProps) {
  const monthlyAmount =
    subscription.billingCycle === 'monthly' ? subscription.amount : subscription.amount / 12;

  return (
    <SwipeableRow
      className="rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm"
      leftActions={[
        ...(onDuplicate
          ? [
              {
                label: 'Duplicate',
                icon: <CopyPlus size={16} />,
                onClick: () => onDuplicate(subscription.id),
                variant: 'neutral' as const,
              },
            ]
          : []),
        {
          label: 'Edit',
          icon: <Edit3 size={16} />,
          onClick: () => onEdit(subscription.id),
          variant: 'primary',
        },
        {
          label: 'Cancel',
          icon: <Trash2 size={16} />,
          onClick: () => onCancel(subscription.id),
          variant: 'danger',
        },
      ]}
      rightActions={[
        {
          label: 'View',
          onClick: () => onView(subscription.id),
          variant: 'neutral',
        },
      ]}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onView(subscription.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onView(subscription.id);
          }
        }}
        className="w-full text-left p-4 space-y-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-primary-dark/40 rounded-2xl"
      >
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <div onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onChange={() => onToggleSelect(subscription.id)}
                aria-label={`Select ${subscription.name}`}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text truncate">
                {subscription.name}
              </h3>
              <Badge variant={subscription.status === 'active' ? 'success' : 'default'} size="sm">
                {subscription.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {subscription.category} {'•'} {subscription.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
              {formatCurrency(subscription.amount, currency)}
            </p>
            {subscription.billingCycle === 'annual' && (
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                {formatCurrency(monthlyAmount, currency)}/mo
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-dark-text-secondary">
          <span>{formatBillingCycle(subscription.billingCycle)}</span>
          <span className="text-gray-300 dark:text-gray-600">{'•'}</span>
          <span>Renews {formatDate(subscription.nextRenewalDate)}</span>
          {subscription.reminderEnabled && (
            <>
              <span className="text-gray-300 dark:text-gray-600">{'•'}</span>
              <span>{subscription.reminderDaysBefore}d notice</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
          <div className="text-sm font-medium text-gray-900 dark:text-dark-text">
            {formatCurrency(monthlyAmount, currency)}/mo avg
          </div>
          {onToggleReminder && (
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-primary dark:text-primary-dark font-medium"
              onClick={(event) => {
                event.stopPropagation();
                onToggleReminder(subscription.id, !subscription.reminderEnabled);
              }}
            >
              {subscription.reminderEnabled ? (
                <>
                  <Bell size={16} />
                  Reminder ON
                </>
              ) : (
                <>
                  <BellOff size={16} />
                  Reminder OFF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </SwipeableRow>
  );
}


