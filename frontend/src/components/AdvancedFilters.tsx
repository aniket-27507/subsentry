import { useState } from 'react';
import { FilterConfig, BillingCycle, Category, PaymentMethod } from '../types';
import Checkbox from './Checkbox';
import PriceRangeFilter from './PriceRangeFilter';
import Button from './Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: FilterConfig;
  onChange: (filters: FilterConfig) => void;
  onClear: () => void;
  currency: string;
}

const categories: Category[] = ['Streaming', 'SaaS', 'Fitness', 'Utilities', 'Other'];
const billingCycles: BillingCycle[] = ['monthly', 'annual', 'custom'];
const paymentMethods: PaymentMethod[] = ['Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'];

const toggleValue = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function AdvancedFilters({ filters, onChange, onClear, currency }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReminderChange = (value: boolean | null) => {
    onChange({ ...filters, reminderEnabled: value });
  };

  return (
    <div className="border border-gray-200 dark:border-dark-border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-dark-text"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Advanced Filters</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-hover space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-dark-text-secondary mb-3">
              Categories
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={filters.categories.includes(category)}
                  onChange={() =>
                    onChange({ ...filters, categories: toggleValue(filters.categories, category) })
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-dark-text-secondary mb-3">
                Billing Cycles
              </p>
              <div className="space-y-2">
                {billingCycles.map((cycle) => (
                  <Checkbox
                    key={cycle}
                    label={cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    checked={filters.billingCycles.includes(cycle)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        billingCycles: toggleValue(filters.billingCycles, cycle),
                      })
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-dark-text-secondary mb-3">
                Payment Methods
              </p>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <Checkbox
                    key={method}
                    label={method}
                    checked={filters.paymentMethods.includes(method)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        paymentMethods: toggleValue(filters.paymentMethods, method),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <PriceRangeFilter value={filters.priceRange} onChange={(priceRange) => onChange({ ...filters, priceRange })} currency={currency} />

          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-dark-text-secondary mb-3">
              Reminders
            </p>
            <div className="flex gap-2">
              <Button
                variant={filters.reminderEnabled === null ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleReminderChange(null)}
              >
                All
              </Button>
              <Button
                variant={filters.reminderEnabled === true ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleReminderChange(true)}
              >
                Enabled
              </Button>
              <Button
                variant={filters.reminderEnabled === false ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleReminderChange(false)}
              >
                Disabled
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onClear}>
              Clear All Filters
            </Button>
            <Button variant="ghost" size="sm" disabled>
              Save Filter Preset (Coming soon)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

