interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-success/10 dark:bg-success-dark/20 text-success dark:text-success-dark border-success/20 dark:border-success-dark/30',
    warning: 'bg-warning/10 dark:bg-warning-dark/20 text-warning dark:text-warning-dark border-warning/20 dark:border-warning-dark/30',
    danger: 'bg-danger/10 dark:bg-danger-dark/20 text-danger dark:text-danger-dark border-danger/20 dark:border-danger-dark/30',
    info: 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/20 dark:border-primary-dark/30',
    default: 'bg-gray-100 dark:bg-dark-surface-hover text-gray-700 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

