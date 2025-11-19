import Input from './Input';
import { PriceRange } from '../types';

interface PriceRangeFilterProps {
  value: PriceRange;
  onChange: (range: PriceRange) => void;
  currency: string;
}

export default function PriceRangeFilter({ value, onChange, currency }: PriceRangeFilterProps) {
  const handleValueChange = (key: keyof PriceRange, raw: string) => {
    const parsed = raw === '' ? null : Number(raw);
    onChange({
      ...value,
      [key]: Number.isNaN(parsed) ? null : parsed,
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Price Range ({currency}/mo)</p>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={value.min ?? ''}
          onChange={(e) => handleValueChange('min', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={value.max ?? ''}
          onChange={(e) => handleValueChange('max', e.target.value)}
        />
      </div>
      <button
        type="button"
        className="text-xs text-primary dark:text-primary-dark underline"
        onClick={() => onChange({ min: null, max: null })}
      >
        Clear range
      </button>
    </div>
  );
}

