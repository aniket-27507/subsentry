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
import { useIsMobile } from '../hooks/useIsMobile';

interface SpendTrendChartProps {
  data: MonthlySpend[];
  currency?: string;
  height?: number;
}

export default function SpendTrendChart({ data, currency = '₹', height }: SpendTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const chartHeight = height ?? (isMobile ? 220 : 320);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-dark-text-secondary">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={data} margin={{ top: 10, right: isMobile ? 10 : 30, bottom: 0, left: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#334155' : '#e5e7eb'} 
        />
        <XAxis
          dataKey="month"
          stroke={isDark ? '#CBD5E1' : '#64748B'}
          style={{ fontSize: isMobile ? '11px' : '12px' }}
          tickMargin={8}
          interval={isMobile ? 1 : 0}
        />
        <YAxis
          stroke={isDark ? '#CBD5E1' : '#64748B'}
          style={{ fontSize: isMobile ? '11px' : '12px' }}
          tickFormatter={(value) => `${currency}${Math.round(value)}`}
          width={isMobile ? 50 : 60}
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
          wrapperStyle={{
            fontSize: isMobile ? '12px' : '14px',
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke={isDark ? '#818CF8' : '#6366F1'}
          strokeWidth={isMobile ? 2 : 3}
          dot={{ fill: isDark ? '#818CF8' : '#6366F1', r: isMobile ? 5 : 4 }}
          activeDot={{ r: isMobile ? 7 : 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

