import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary dark:bg-primary-dark text-white hover:bg-primary/90 dark:hover:bg-primary-dark/90 shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-hover shadow-sm',
    danger: 'bg-danger dark:bg-danger-dark text-white hover:bg-danger/90 dark:hover:bg-danger-dark/90 shadow-sm hover:shadow-md',
    ghost: 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-hover',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

