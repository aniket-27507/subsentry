import { useNavigate } from 'react-router-dom';
import { DollarSign, CreditCard, Bell, TrendingUp, PlusCircle, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MetricCard } from '../components/Card';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import CategoryChart from '../components/CategoryChart';
import { formatCurrency, formatShortDate } from '../utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    subscriptions,
    getDashboardMetrics,
    getCategorySpend,
    getUpcomingRenewals,
    user,
  } = useStore();

  const metrics = getDashboardMetrics();
  const categorySpend = getCategorySpend();
  const upcomingRenewals = getUpcomingRenewals(30);
  const currency = user?.currencyPreference || '₹';

  const handleAddSubscription = () => {
    navigate('/add');
  };

  const handleViewSubscription = (id: string) => {
    navigate(`/subscription/${id}`);
  };

  if (subscriptions.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
              See every subscription in one clear view
            </p>
          </div>
        </div>

        <Card className="p-12">
          <EmptyState
            icon={<CreditCard size={32} />}
            title="No subscriptions added yet"
            description="Log your first subscription to reveal your real monthly spend and start taking control of your recurring costs."
            action={{
              label: '+ Add Your First Subscription',
              onClick: handleAddSubscription,
            }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            Welcome back, {user?.name}! Here's your subscription overview.
          </p>
        </div>
        <Button onClick={handleAddSubscription} variant="primary">
          <PlusCircle size={20} className="inline mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Monthly Spend"
          value={formatCurrency(metrics.totalMonthlySpend, currency)}
          subtitle="Total recurring monthly"
          icon={<DollarSign size={24} />}
        />
        <MetricCard
          title="Annual Spend"
          value={formatCurrency(metrics.totalAnnualSpend, currency)}
          subtitle="Total per year"
          icon={<TrendingUp size={24} />}
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptionsCount}
          subtitle="Currently tracked"
          icon={<CreditCard size={24} />}
        />
        <MetricCard
          title="Upcoming Renewals"
          value={metrics.upcomingRenewalsCount}
          subtitle="Next 30 days"
          icon={<Bell size={24} />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Renewals */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Upcoming Renewals</h2>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                Next 30 days - don't let these surprise you
              </p>
            </div>
            <Button onClick={() => navigate('/subscriptions')} variant="secondary" size="sm">
              View All
            </Button>
          </div>

          {upcomingRenewals.length === 0 ? (
            <EmptyState
              icon={<Calendar size={24} />}
              title="You're all clear"
              description="No renewals in the next 30 days. Check back later or add more subscriptions."
            />
          ) : (
            <div className="space-y-3">
              {upcomingRenewals.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleViewSubscription(sub.id)}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-hover cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text">{sub.name}</h3>
                      <Badge variant={sub.daysUntilRenewal <= 3 ? 'warning' : 'info'} size="sm">
                        {sub.daysUntilRenewal} days
                      </Badge>
                      {sub.reminderEnabled && (
                        <Badge variant="success" size="sm">
                          <Bell size={12} className="inline mr-1" />
                          Reminder ON
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                      Renews on {formatShortDate(sub.nextRenewalDate)} • {sub.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-dark-text">
                      {formatCurrency(sub.amount, currency)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{sub.billingCycle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Spend by Category */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Spend by Category</h2>
          {categorySpend.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-dark-text-secondary">
              No data yet
            </div>
          ) : (
            <div>
              <CategoryChart data={categorySpend} currency={currency} />
              <div className="mt-4 space-y-2">
                {categorySpend.slice(0, 3).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-dark-text-secondary">{cat.category}</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-text">
                      {formatCurrency(cat.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/add')}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/10 transition-colors text-left"
          >
            <PlusCircle size={24} className="text-primary dark:text-primary-dark mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">Add Subscription</h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">Log a new recurring payment</p>
          </button>
          
          <button
            onClick={() => navigate('/onboarding')}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/10 transition-colors text-left"
          >
            <Calendar size={24} className="text-primary dark:text-primary-dark mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">Conduct Audit</h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">Review all your subscriptions</p>
          </button>
          
          <button
            onClick={() => navigate('/insights')}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/10 transition-colors text-left"
          >
            <TrendingUp size={24} className="text-primary dark:text-primary-dark mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">View Insights</h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">See spending trends and savings</p>
          </button>
        </div>
      </Card>
    </div>
  );
}

