import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1.5">
            {label}
            {props.required && <span className="text-danger dark:text-danger-dark ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 bg-white dark:bg-dark-surface dark:text-dark-text ${
            error
              ? 'border-danger dark:border-danger-dark focus:border-danger dark:focus:border-danger-dark'
              : 'border-gray-300 dark:border-dark-border focus:border-primary dark:focus:border-primary-dark'
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="dark:bg-dark-surface">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-danger dark:text-danger-dark">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-dark-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

