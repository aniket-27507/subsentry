import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border ${className} ${
        onClick ? 'cursor-pointer hover:shadow-md dark:hover:bg-dark-surface-hover transition-all' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                trend.isPositive ? 'text-success dark:text-success-dark' : 'text-danger dark:text-danger-dark'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 dark:bg-primary-dark/10 rounded-lg text-primary dark:text-primary-dark">{icon}</div>
        )}
      </div>
    </Card>
  );
}

