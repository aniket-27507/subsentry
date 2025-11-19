import Select from './Select';
import { SortConfig } from '../types';

interface SortDropdownProps {
  value: SortConfig;
  onChange: (config: SortConfig) => void;
}

const sortOptions: Array<{ label: string; value: string; field: SortConfig['field']; order: SortConfig['order'] }> =
  [
    { label: 'Name (A-Z)', value: 'name-asc', field: 'name', order: 'asc' },
    { label: 'Name (Z-A)', value: 'name-desc', field: 'name', order: 'desc' },
    { label: 'Amount (Low ΓåÆ High)', value: 'amount-asc', field: 'amount', order: 'asc' },
    { label: 'Amount (High ΓåÆ Low)', value: 'amount-desc', field: 'amount', order: 'desc' },
    { label: 'Monthly (Low ΓåÆ High)', value: 'monthlyAmount-asc', field: 'monthlyAmount', order: 'asc' },
    { label: 'Monthly (High ΓåÆ Low)', value: 'monthlyAmount-desc', field: 'monthlyAmount', order: 'desc' },
    { label: 'Next Renewal (Soonest)', value: 'nextRenewalDate-asc', field: 'nextRenewalDate', order: 'asc' },
    { label: 'Next Renewal (Latest)', value: 'nextRenewalDate-desc', field: 'nextRenewalDate', order: 'desc' },
    { label: 'Date Added (Newest)', value: 'createdAt-desc', field: 'createdAt', order: 'desc' },
    { label: 'Date Added (Oldest)', value: 'createdAt-asc', field: 'createdAt', order: 'asc' },
    { label: 'Category (A-Z)', value: 'category-asc', field: 'category', order: 'asc' },
    { label: 'Category (Z-A)', value: 'category-desc', field: 'category', order: 'desc' },
  ];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const currentValue = `${value.field}-${value.order}`;

  return (
    <Select
      value={currentValue}
      onChange={(e) => {
        const selected = sortOptions.find((option) => option.value === e.target.value);
        if (selected) {
          onChange({ field: selected.field, order: selected.order });
        }
      }}
      options={sortOptions.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
      aria-label="Sort subscriptions"
    />
  );
}

