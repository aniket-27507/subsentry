import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlySpend } from '../types';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../contexts/ThemeContext';

interface SpendTrendChartProps {
  data: MonthlySpend[];
  currency?: string;
}

export default function SpendTrendChart({ data, currency = '₹' }: SpendTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-dark-text-secondary">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#334155' : '#e5e7eb'} 
        />
        <XAxis
          dataKey="month"
          stroke={isDark ? '#CBD5E1' : '#64748B'}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke={isDark ? '#CBD5E1' : '#64748B'}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `${currency}${value}`}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value, currency)}
          contentStyle={{
            backgroundColor: isDark ? '#1E293B' : 'white',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: isDark ? '#F1F5F9' : '#111827',
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke={isDark ? '#818CF8' : '#6366F1'}
          strokeWidth={2}
          dot={{ fill: isDark ? '#818CF8' : '#6366F1', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

