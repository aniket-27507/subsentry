import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  CreditCard,
  Bell,
  TrendingUp,
  PlusCircle,
  Calendar,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MetricCard } from '../components/Card';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import CategoryChart from '../components/CategoryChart';
import { formatCurrency, formatShortDate } from '../utils/format';
import { Budget } from '../types';
import BudgetCard from '../components/BudgetCard';
import BudgetSetupModal from '../components/BudgetSetupModal';
import BudgetAlertBanner from '../components/BudgetAlertBanner';
import PullToRefresh from '../components/PullToRefresh';
import SwipeableRow from '../components/SwipeableRow';
import MobileChartWrapper from '../components/MobileChartWrapper';
import InteractiveTutorial, { TutorialStep } from '../components/InteractiveTutorial';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    subscriptions,
    getDashboardMetrics,
    getCategorySpend,
    getUpcomingRenewals,
    user,
    budget,
    getBudgetStatus,
    checkBudgetAlerts,
    setBudget,
    updateBudget,
    markTutorialCompletion,
  } = useStore();

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetBannerDismissed, setBudgetBannerDismissed] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
  const [hasAutoLaunchedTour, setHasAutoLaunchedTour] = useState(false);

  const metrics = getDashboardMetrics();
  const categorySpend = getCategorySpend();
  const upcomingRenewals = getUpcomingRenewals(30);
  const currency = user?.currencyPreference || '₹';
  const budgetStatus = getBudgetStatus();
  const budgetAlert = checkBudgetAlerts();
  const hasCompletedTutorial = user?.hasCompletedTutorial ?? false;
  const hasSubscriptions = subscriptions.length > 0;
  const showBudgetBanner = budget && budgetAlert !== 'none' && !budgetBannerDismissed;

  const tutorialSteps = useMemo<TutorialStep[]>(() => {
    if (!hasSubscriptions) {
      return [
        {
          id: 'empty-overview',
          title: 'Add your first subscription',
          description:
            'Use this card to log the services you pay for. Once added, the dashboard will populate automatically.',
          selector: '[data-tutorial-target="dashboard-empty"]',
        },
        {
          id: 'empty-tour',
          title: 'Relaunch the tour anytime',
          description:
            'The Guided Tour button keeps you oriented. Tap it whenever you want a refresher.',
          selector: '[data-tutorial-target="dashboard-header"]',
          placement: 'bottom',
        },
      ];
    }

    const steps: TutorialStep[] = [
      {
        id: 'header',
        title: 'Your control center',
        description: 'This header greets you, keeps context, and lets you relaunch the guided tour.',
        selector: '[data-tutorial-target="dashboard-header"]',
        placement: 'bottom',
      },
      {
        id: 'metrics',
        title: 'Key spending metrics',
        description:
          'Track monthly and annual spend plus active subscriptions at a glance. These values update instantly.',
        selector: '[data-tutorial-target="dashboard-metrics"]',
      },
      {
        id: 'upcoming',
        title: 'Never miss a renewal',
        description:
          'Upcoming renewals surface every charge due in the next 30 days so you can act before money leaves.',
        selector: '[data-tutorial-target="dashboard-upcoming"]',
      },
      {
        id: 'category',
        title: 'Spot spending patterns',
        description:
          'See which categories dominate your budget and compare amounts to identify trimming opportunities.',
        selector: '[data-tutorial-target="dashboard-category"]',
        placement: 'right',
      },
      {
        id: 'budget',
        title: budget ? 'Stay on budget' : 'Set smart guardrails',
        description: budget
          ? 'Budget overview shows progress toward your monthly and annual limits with alerts when you get close.'
          : 'Set monthly and annual budgets to get proactive alerts before you overspend.',
        selector: '[data-tutorial-target="dashboard-budget"]',
      },
      {
        id: 'actions',
        title: 'Take action fast',
        description:
          'Quick actions help you add new subs, run audits, or jump to insights in a single tap.',
        selector: '[data-tutorial-target="dashboard-actions"]',
      },
    ];

    return steps;
  }, [hasSubscriptions, budget]);

  useEffect(() => {
    if (!user || hasCompletedTutorial || isTutorialActive || hasAutoLaunchedTour) return;
    if (tutorialSteps.length === 0) return;

    const timer = window.setTimeout(() => {
      setTutorialStepIndex(0);
      setIsTutorialActive(true);
      setHasAutoLaunchedTour(true);
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    user,
    hasCompletedTutorial,
    isTutorialActive,
    hasAutoLaunchedTour,
    tutorialSteps.length,
  ]);

  const handleStartTutorial = () => {
    if (tutorialSteps.length === 0) return;
    setTutorialStepIndex(0);
    setIsTutorialActive(true);
  };

  const handleCloseTutorial = (completed: boolean) => {
    setIsTutorialActive(false);
    setHasAutoLaunchedTour(true);
    if (completed) {
      markTutorialCompletion(true);
    }
  };

  const handleSkipTutorial = () => {
    handleCloseTutorial(true);
  };

  const handleNextTutorialStep = () => {
    setTutorialStepIndex((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handlePrevTutorialStep = () => {
    setTutorialStepIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setBudgetBannerDismissed(false);
  }, []);

  const handleAddSubscription = () => {
    navigate('/add');
  };

  const handleViewSubscription = (id: string) => {
    navigate(`/subscription/${id}`);
  };

  const handleSaveBudget = (
    data: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (budget) {
      updateBudget(data);
    } else {
      setBudget(data);
    }
    setIsBudgetModalOpen(false);
    setBudgetBannerDismissed(false);
  };

  const headerSubtitle = hasSubscriptions
    ? `Welcome back, ${user?.name || 'friend'}! Here's your subscription overview.`
    : 'See every subscription in one clear view';

  const header = (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
      data-tutorial-target="dashboard-header"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary mt-1 text-sm sm:text-base">
          {headerSubtitle}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleStartTutorial}
          disabled={tutorialSteps.length === 0}
          className="flex items-center gap-2 border border-dashed border-primary/30 text-primary dark:text-primary-dark hover:border-primary dark:hover:border-primary-dark"
        >
          <Sparkles size={18} />
          Guided Tour
        </Button>
        <Button onClick={handleAddSubscription} variant="primary" className="flex-1 sm:flex-none">
          <PlusCircle size={20} className="inline mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>
  );

  if (!hasSubscriptions) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <div>
          {header}
          <div data-tutorial-target="dashboard-empty">
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
        </div>
        <InteractiveTutorial
          steps={tutorialSteps}
          isOpen={isTutorialActive && tutorialSteps.length > 0}
          currentStepIndex={tutorialStepIndex}
          onClose={handleCloseTutorial}
          onNext={handleNextTutorialStep}
          onPrev={handlePrevTutorialStep}
          onSkip={handleSkipTutorial}
        />
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {/* Header */}
      {header}

      {showBudgetBanner && (
        <BudgetAlertBanner
          alert={budgetAlert}
          budgetStatus={budgetStatus}
          currency={currency}
          onDismiss={() => setBudgetBannerDismissed(true)}
          onViewBudget={() => setIsBudgetModalOpen(true)}
        />
      )}

      {/* Metrics Cards */}
      <div
        className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        data-tutorial-target="dashboard-metrics"
      >
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

      <div className="mb-8" data-tutorial-target="dashboard-budget">
        {budget ? (
          <BudgetCard
            budgetStatus={budgetStatus}
            currency={currency}
            alertThreshold={budget.alertThreshold}
            onEdit={() => setIsBudgetModalOpen(true)}
          />
        ) : (
          <Card className="p-4 sm:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                Stay ahead with a budget
              </h2>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                Set monthly and annual targets to get alerts before you overspend.
              </p>
            </div>
            <Button onClick={() => setIsBudgetModalOpen(true)}>Set Your Budget</Button>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Upcoming Renewals */}
        <div className="lg:col-span-2" data-tutorial-target="dashboard-upcoming">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
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
                  <SwipeableRow
                    key={sub.id}
                    leftActions={[
                      {
                        label: 'View',
                        onClick: () => handleViewSubscription(sub.id),
                        variant: 'neutral',
                      },
                      {
                        label: 'Edit',
                        icon: <Edit3 size={16} />,
                        onClick: () => navigate(`/edit/${sub.id}`),
                      },
                    ]}
                  >
                    <div
                      onClick={() => handleViewSubscription(sub.id)}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-hover cursor-pointer transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
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
                          Renews on {formatShortDate(sub.nextRenewalDate)} {'• '} {sub.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-dark-text">
                          {formatCurrency(sub.amount, currency)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{sub.billingCycle}</p>
                      </div>
                    </div>
                  </SwipeableRow>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Spend by Category */}
        <div data-tutorial-target="dashboard-category">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Spend by Category</h2>
            {categorySpend.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-dark-text-secondary">
                No data yet
              </div>
            ) : (
              <div className="space-y-4">
                <MobileChartWrapper>
                  {({ height }) => <CategoryChart data={categorySpend} currency={currency} height={height} />}
                </MobileChartWrapper>
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
      </div>

      <div data-tutorial-target="dashboard-actions">
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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

      {isBudgetModalOpen && (
        <BudgetSetupModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSave={handleSaveBudget}
          existingBudget={budget ?? undefined}
          currentSpending={{
            monthly: metrics.totalMonthlySpend,
            annual: metrics.totalAnnualSpend,
          }}
        />
      )}

      <InteractiveTutorial
        steps={tutorialSteps}
        isOpen={isTutorialActive && tutorialSteps.length > 0}
        currentStepIndex={tutorialStepIndex}
        onClose={handleCloseTutorial}
        onNext={handleNextTutorialStep}
        onPrev={handlePrevTutorialStep}
        onSkip={handleSkipTutorial}
      />
    </PullToRefresh>
  );
}