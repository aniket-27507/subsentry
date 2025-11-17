import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import Card, { MetricCard } from '../components/Card';
import Button from '../components/Button';
import SpendTrendChart from '../components/SpendTrendChart';
import CategoryChart from '../components/CategoryChart';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/format';

export default function Insights() {
  const navigate = useNavigate();
  const {
    subscriptions,
    getDashboardMetrics,
    getCategorySpend,
    getMonthlySpendTrend,
    getTopExpensiveSubscriptions,
    user,
  } = useStore();

  const metrics = getDashboardMetrics();
  const categorySpend = getCategorySpend();
  const monthlyTrend = getMonthlySpendTrend();
  const topSubscriptions = getTopExpensiveSubscriptions(3);
  const currency = user?.currencyPreference || '₹';

  if (subscriptions.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8">Insights & Reports</h1>
        <EmptyState
          icon={<PieChartIcon size={32} />}
          title="No insights yet"
          description="Add some subscriptions first to see your spending patterns and insights."
          action={{
            label: '+ Add Subscription',
            onClick: () => navigate('/add'),
          }}
        />
      </div>
    );
  }

  // Calculate potential savings (mock logic)
  const lowUsageSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'active' && sub.amount < 500
  );
  const potentialSavings = lowUsageSubscriptions.reduce((sum, sub) => {
    const monthly = sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;
    return sum + monthly;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Insights & Reports</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            Understand your spending patterns and find savings opportunities
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Monthly Spend"
          value={formatCurrency(metrics.totalMonthlySpend, currency)}
          subtitle="All active subscriptions"
          icon={<DollarSign size={24} />}
        />
        <MetricCard
          title="Annual Spend"
          value={formatCurrency(metrics.totalAnnualSpend, currency)}
          subtitle="Projected yearly cost"
          icon={<TrendingUp size={24} />}
        />
        <MetricCard
          title="Potential Savings"
          value={formatCurrency(potentialSavings, currency)}
          subtitle={`From ${lowUsageSubscriptions.length} low-cost subs`}
          icon={<TrendingDown size={24} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">
            Monthly Spend Trend
          </h2>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
            Your subscription spending over the last 12 months
          </p>
          <SpendTrendChart data={monthlyTrend} currency={currency} />
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">
            Spend by Category
          </h2>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
            Where your subscription money goes
          </p>
          <CategoryChart data={categorySpend} currency={currency} />
        </Card>
      </div>

      {/* Top Expenses */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">
          Top 3 Most Expensive Subscriptions
        </h2>
        <div className="space-y-4">
          {topSubscriptions.map((sub, index) => {
            const monthlyAmount =
              sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;
            return (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-hover cursor-pointer transition-colors"
                onClick={() => navigate(`/subscription/${sub.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center text-primary dark:text-primary-dark font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text">{sub.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                      {sub.category} • {sub.billingCycle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                    {formatCurrency(sub.amount, currency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    {formatCurrency(monthlyAmount, currency)}/mo
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Savings Opportunity */}
      {potentialSavings > 0 && (
        <Card className="p-6 bg-success/5 dark:bg-success-dark/10 border-success/20 dark:border-success-dark/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 dark:bg-success-dark/20 flex items-center justify-center">
              <TrendingDown size={24} className="text-success dark:text-success-dark" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
                💰 Potential Savings Opportunity
              </h3>
              <p className="text-gray-700 dark:text-dark-text-secondary mb-4">
                You could save up to{' '}
                <strong className="text-success dark:text-success-dark">
                  {formatCurrency(potentialSavings, currency)}/month
                </strong>{' '}
                by reviewing and cancelling subscriptions you don't frequently use.
              </p>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
                Found {lowUsageSubscriptions.length} subscription
                {lowUsageSubscriptions.length !== 1 ? 's' : ''} that might be worth reviewing.
              </p>
              <Button onClick={() => navigate('/subscriptions')} variant="primary">
                Review Subscriptions
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

