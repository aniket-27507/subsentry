import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySpend } from '../types';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../contexts/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';

interface CategoryChartProps {
  data: CategorySpend[];
  currency?: string;
  height?: number;
}

// Colors optimized for both light and dark mode
const LIGHT_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const DARK_COLORS = ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

export default function CategoryChart({ data, currency = '₹', height }: CategoryChartProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const chartHeight = height ?? (isMobile ? 220 : 300);
  const outerRadius = isMobile ? 70 : 90;
  
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-dark-text-secondary">
        No category data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <PieChart>
        <Pie
          data={data as any[]}
          cx="50%"
          cy="50%"
          labelLine={!isMobile}
          label={(props: any) =>
            isMobile ? `${props.percentage}%` : `${props.category} (${props.percentage}%)`
          }
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="amount"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value, currency)}
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1E293B' : 'white',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: theme === 'dark' ? '#F1F5F9' : '#111827',
          }}
        />
        <Legend
          verticalAlign={isMobile ? 'bottom' : 'middle'}
          align={isMobile ? 'center' : 'right'}
          layout={isMobile ? 'horizontal' : 'vertical'}
          iconType="circle"
          wrapperStyle={{
            color: theme === 'dark' ? '#CBD5E1' : '#374151',
            paddingTop: isMobile ? 12 : 0,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
