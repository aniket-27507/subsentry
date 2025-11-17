import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1.5">
            {label}
            {props.required && <span className="text-danger dark:text-danger-dark ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-surface dark:text-dark-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 ${
            error
              ? 'border-danger dark:border-danger-dark focus:border-danger dark:focus:border-danger-dark'
              : 'border-gray-300 dark:border-dark-border focus:border-primary dark:focus:border-primary-dark'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger dark:text-danger-dark">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-dark-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

