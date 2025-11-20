import { useMemo, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Bell,
  BellOff,
  CalendarClock,
  Sparkles,
  BellRing,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Subscription,
  Category,
  BillingCycle,
  SubscriptionStatus,
  FilterConfig,
  SortConfig,
  PaymentMethod,
} from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatDate, formatBillingCycle } from '../utils/format';
import BulkActionsBar from '../components/BulkActionsBar';
import BulkEditModal from '../components/BulkEditModal';
import Checkbox from '../components/Checkbox';
import SortDropdown from '../components/SortDropdown';
import AdvancedFilters from '../components/AdvancedFilters';
import Toast from '../components/Toast';
import PullToRefresh from '../components/PullToRefresh';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileSubscriptionCard from '../components/MobileSubscriptionCard';
import InteractiveTutorial, { TutorialStep } from '../components/InteractiveTutorial';

type QuickFilter = 'expiringSoon' | 'mostExpensive' | 'noReminders' | null;

const DUPLICATE_HINT_STORAGE_KEY = 'subsentry_micro_hint_duplicate';

const createDefaultFilters = (): FilterConfig => ({
  categories: [],
  billingCycles: [],
  statuses: ['active'],
  paymentMethods: [],
  priceRange: { min: null, max: null },
  reminderEnabled: null,
  searchQuery: '',
});

const quickFilterConfig: Array<{
  key: Exclude<QuickFilter, null>;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    key: 'expiringSoon',
    label: 'Expiring Soon',
    description: 'Renewals in next 7 days',
    icon: <CalendarClock size={16} />,
  },
  {
    key: 'mostExpensive',
    label: 'Top Spenders',
    description: 'Highest monthly cost',
    icon: <Sparkles size={16} />,
  },
  {
    key: 'noReminders',
    label: 'No Reminder',
    description: 'Reminder is off',
    icon: <BellRing size={16} />,
  },
];

const getMonthlyAmount = (sub: Subscription) =>
  sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;

export default function Subscriptions() {
  const navigate = useNavigate();
  const {
    subscriptions,
    user,
    filterSubscriptions,
    sortSubscriptions,
    bulkDeleteSubscriptions,
    bulkCancelSubscriptions,
    bulkToggleReminders,
    bulkUpdateSubscriptions,
    getUpcomingRenewals,
    getTopExpensiveSubscriptions,
    updateSubscription,
    setSubscriptionDraft,
    buildDraftFromSubscription,
  } = useStore();

  const currency = user?.currencyPreference || '₹';
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState<FilterConfig>(createDefaultFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);
  const [hasDuplicateHintBeenSeen, setHasDuplicateHintBeenSeen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(DUPLICATE_HINT_STORAGE_KEY) === 'true';
  });
  const [isDuplicateHintOpen, setIsDuplicateHintOpen] = useState(false);
  const [duplicateHintTargetId, setDuplicateHintTargetId] = useState<string | null>(null);
  const duplicateHintSteps = useMemo<TutorialStep[]>(() => {
    if (!duplicateHintTargetId) return [];
    return [
      {
        id: 'duplicate-hint',
        title: 'Duplicate & tweak fast',
        description:
          'Use Duplicate to jump into the add form with these details pre-filled—great for annual renewals or team seats.',
        selector: `#${duplicateHintTargetId}`,
        placement: 'left',
      },
    ];
  }, [duplicateHintTargetId]);

  const quickFilteredSubscriptions = useMemo(() => {
    if (!quickFilter) return subscriptions;

    if (quickFilter === 'expiringSoon') {
      const upcomingIds = new Set(getUpcomingRenewals(7).map((sub) => sub.id));
      return subscriptions.filter((sub) => upcomingIds.has(sub.id));
    }

    if (quickFilter === 'mostExpensive') {
      const expensiveIds = new Set(getTopExpensiveSubscriptions(10).map((sub) => sub.id));
      return subscriptions.filter((sub) => expensiveIds.has(sub.id));
    }

    return subscriptions.filter((sub) => !sub.reminderEnabled);
  }, [subscriptions, quickFilter, getUpcomingRenewals, getTopExpensiveSubscriptions]);

  const processedSubscriptions = useMemo(() => {
    const filtered = filterSubscriptions(quickFilteredSubscriptions, filters);
    return sortSubscriptions(filtered, sortConfig);
  }, [filterSubscriptions, quickFilteredSubscriptions, filters, sortConfig, sortSubscriptions]);

  const selectedVisibleIds = useMemo(
    () =>
      selectedIds.filter((id) =>
        processedSubscriptions.some((sub) => sub.id === id)
      ),
    [selectedIds, processedSubscriptions]
  );

  const selectedVisibleSet = useMemo(
    () => new Set(selectedVisibleIds),
    [selectedVisibleIds]
  );

  const handleRowClick = (id: string) => {
    if (selectedIds.length > 0) {
      handleToggleSelect(id);
      return;
    }
    navigate(`/subscription/${id}`);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/edit/${id}`);
  };

  const handleEditNavigate = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(processedSubscriptions.map((sub) => sub.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const allSelected =
    processedSubscriptions.length > 0 &&
    selectedVisibleIds.length === processedSubscriptions.length;
  const indeterminate = selectedVisibleIds.length > 0 && !allSelected;

  const statusSelectValue =
    filters.statuses.length === 0 ? 'all' : (filters.statuses[0] as SubscriptionStatus);

  const activeFilterCount = useMemo(() => {
    const statusDefault =
      filters.statuses.length === 1 && filters.statuses[0] === 'active';
    let count = 0;
    if (filters.searchQuery.trim()) count += 1;
    count += filters.categories.length;
    count += filters.billingCycles.length;
    count += filters.paymentMethods.length;
    if (!statusDefault && filters.statuses.length) count += 1;
    if (filters.priceRange.min !== null) count += 1;
    if (filters.priceRange.max !== null) count += 1;
    if (filters.reminderEnabled !== null) count += 1;
    return count;
  }, [filters]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
    },
    [],
  );

  const markDuplicateHintSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DUPLICATE_HINT_STORAGE_KEY, 'true');
    }
    setHasDuplicateHintBeenSeen(true);
  }, []);

  const handleDuplicateHintTrigger = useCallback(
    (targetId: string) => {
      if (hasDuplicateHintBeenSeen || isDuplicateHintOpen) return;
      setDuplicateHintTargetId(targetId);
      setIsDuplicateHintOpen(true);
    },
    [hasDuplicateHintBeenSeen, isDuplicateHintOpen],
  );

  const handleDuplicateHintClose = useCallback(() => {
    markDuplicateHintSeen();
    setIsDuplicateHintOpen(false);
    setDuplicateHintTargetId(null);
  }, [markDuplicateHintSeen]);

  const handleDuplicateHintNext = () => {
    handleDuplicateHintClose();
  };

  const handleDuplicateHintPrev = () => {
    handleDuplicateHintClose();
  };

  const handleDuplicateHintSkip = () => {
    handleDuplicateHintClose();
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    showToast('Subscriptions refreshed', 'info');
  }, [showToast]);

  const handleBulkDelete = async () => {
    if (
      selectedVisibleIds.length === 0 ||
      !window.confirm('Delete selected subscriptions? This action cannot be undone.')
    ) {
      return;
    }
    const result = await bulkDeleteSubscriptions(selectedVisibleIds);
    setSelectedIds((prev) => prev.filter((id) => !selectedVisibleSet.has(id)));
    showToast(
      `Deleted ${result.success} subscription${result.success === 1 ? '' : 's'}`,
      result.failed > 0 ? 'warning' : 'success'
    );
  };

  const handleBulkCancel = async () => {
    if (selectedVisibleIds.length === 0) return;
    const result = await bulkCancelSubscriptions(selectedVisibleIds);
    showToast(
      `Marked ${result.success} subscription${result.success === 1 ? '' : 's'} as cancelled`,
      result.failed > 0 ? 'warning' : 'success'
    );
    if (result.success > 0) {
      setSelectedIds((prev) => prev.filter((id) => !selectedVisibleSet.has(id)));
    }
  };

  const handleBulkToggleReminders = async (enabled: boolean) => {
    if (selectedVisibleIds.length === 0) return;
    const result = await bulkToggleReminders(selectedVisibleIds, enabled);
    showToast(
      `${enabled ? 'Enabled' : 'Disabled'} reminders for ${result.success} subscription${
        result.success === 1 ? '' : 's'
      }`,
      result.failed > 0 ? 'warning' : 'success'
    );
  };

  const handleBulkEditSave = async (
    updates: Partial<{ category: Category; paymentMethod: PaymentMethod }>
  ) => {
    if (Object.keys(updates).length === 0) return;
    if (selectedVisibleIds.length === 0) return;
    const result = await bulkUpdateSubscriptions(selectedVisibleIds, updates);
    showToast(
      `Updated ${result.success} subscription${result.success === 1 ? '' : 's'}`,
      result.failed > 0 ? 'warning' : 'success'
    );
    setIsBulkEditOpen(false);
    if (result.success > 0) {
      setSelectedIds((prev) => prev.filter((id) => !selectedVisibleSet.has(id)));
    }
  };

  const handleQuickFilterChange = (key: Exclude<QuickFilter, null>) => {
    setQuickFilter((prev) => (prev === key ? null : key));
  };

  const handleClearFilters = () => {
    setFilters(createDefaultFilters());
    setQuickFilter(null);
  };

  const handleToggleReminder = async (id: string, enabled: boolean) => {
    await updateSubscription(id, { reminderEnabled: enabled });
    showToast(`Reminder ${enabled ? 'enabled' : 'disabled'}`, 'success');
  };

  const handleSingleCancel = async (id: string) => {
    const result = await bulkCancelSubscriptions([id]);
    if (result.success > 0) {
      showToast('Subscription marked as cancelled', 'success');
    } else {
      showToast('Unable to cancel subscription', 'warning');
    }
  };

  const handleDuplicate = (id: string) => {
    const draft = buildDraftFromSubscription(id);
    if (!draft) {
      showToast('Unable to duplicate subscription', 'warning');
      return;
    }
    if (!hasDuplicateHintBeenSeen) {
      markDuplicateHintSeen();
    }
    if (isDuplicateHintOpen) {
      setIsDuplicateHintOpen(false);
      setDuplicateHintTargetId(null);
    }
    setSubscriptionDraft(draft, 'duplicate');
    navigate('/add');
  };

  if (subscriptions.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">All Subscriptions</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
              Manage all your recurring payments
            </p>
          </div>
        </div>

        <EmptyState
          icon={<PlusCircle size={32} />}
          title="No subscriptions yet"
          description="Start by adding your first subscription to track your recurring costs."
          action={{
            label: '+ Add Subscription',
            onClick: () => navigate('/add'),
          }}
        />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">All Subscriptions</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            {processedSubscriptions.length} of {subscriptions.length} subscriptions
          </p>
        </div>
        <Button onClick={() => navigate('/add')} variant="primary">
          <PlusCircle size={20} className="inline mr-2" />
          Add Subscription
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 sm:p-6 mb-6 space-y-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-secondary"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.categories[0] || 'all'}
            onChange={(e) =>
              setFilters({
                ...filters,
                categories: e.target.value === 'all' ? [] : [e.target.value as Category],
              })
            }
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Streaming', label: 'Streaming' },
              { value: 'SaaS', label: 'SaaS' },
              { value: 'Fitness', label: 'Fitness' },
              { value: 'Utilities', label: 'Utilities' },
              { value: 'Other', label: 'Other' },
            ]}
          />

          <Select
            value={filters.billingCycles[0] || 'all'}
            onChange={(e) =>
              setFilters({
                ...filters,
                billingCycles: e.target.value === 'all' ? [] : [e.target.value as BillingCycle],
              })
            }
            options={[
              { value: 'all', label: 'All Cycles' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Annual' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Select
            value={statusSelectValue}
            onChange={(e) =>
              setFilters({
                ...filters,
                statuses:
                  e.target.value === 'all' ? [] : [e.target.value as SubscriptionStatus],
              })
            }
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />

          <div className="lg:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-dark-text">
                Active filters:
              </span>
              <Badge variant="default" size="sm">
                {activeFilterCount}
              </Badge>
              {quickFilter && (
                <Badge variant="info" size="sm">
                  Quick: {quickFilter.replace(/([A-Z])/g, ' $1')}
                </Badge>
              )}
            </div>
            <div className="w-full md:w-64">
              <SortDropdown value={sortConfig} onChange={setSortConfig} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickFilterConfig.map((item) => {
            const isActive = quickFilter === item.key;
            return (
              <button
                key={item.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white border-primary dark:bg-primary-dark dark:border-primary-dark'
                    : 'border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-primary dark:hover:border-primary-dark'
                }`}
                onClick={() => handleQuickFilterChange(item.key)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                <span className="text-xs opacity-75">{item.description}</span>
              </button>
            );
          })}
        </div>

        <AdvancedFilters
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
          currency={currency}
        />
      </div>

      {selectedVisibleIds.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-30 md:relative md:bottom-auto md:left-auto md:right-auto">
          <BulkActionsBar
            selectedCount={selectedVisibleIds.length}
            totalCount={processedSubscriptions.length}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkDelete={handleBulkDelete}
            onBulkCancel={handleBulkCancel}
            onBulkToggleReminders={handleBulkToggleReminders}
            onBulkEdit={() => setIsBulkEditOpen(true)}
          />
        </div>
      )}

      {processedSubscriptions.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-12">
          <EmptyState
            icon={<Search size={32} />}
            title="No matches found"
            description="Try adjusting your filters or search query."
            action={{
              label: 'Reset Filters',
              onClick: handleClearFilters,
            }}
          />
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {processedSubscriptions.map((sub) => (
            <MobileSubscriptionCard
              key={sub.id}
              subscription={sub}
              currency={currency}
              onView={handleRowClick}
              onEdit={handleEditNavigate}
              onCancel={handleSingleCancel}
              onDuplicate={handleDuplicate}
              onToggleReminder={handleToggleReminder}
              onToggleSelect={handleToggleSelect}
              isSelected={selectedIds.includes(sub.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-surface-hover border-b border-gray-200 dark:border-dark-border">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      aria-label="Select all subscriptions"
                      checked={allSelected}
                      indeterminate={indeterminate}
                      onChange={() => (allSelected ? handleClearSelection() : handleSelectAll())}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Next Renewal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Reminder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                {processedSubscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => handleRowClick(sub.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface-hover transition-colors"
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={`Select ${sub.name}`}
                        checked={selectedIds.includes(sub.id)}
                        onChange={() => handleToggleSelect(sub.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-dark-text">{sub.name}</div>
                      <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{sub.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default" size="sm">
                        {sub.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-dark-text">
                        {formatCurrency(sub.amount, currency)}
                      </div>
                      {sub.billingCycle === 'annual' && (
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                          {formatCurrency(getMonthlyAmount(sub), currency)}/mo
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-dark-text-secondary">
                      {formatBillingCycle(sub.billingCycle)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-dark-text-secondary">
                      {formatDate(sub.nextRenewalDate)}
                    </td>
                    <td className="px-6 py-4">
                      {sub.reminderEnabled ? (
                        <Badge variant="success" size="sm">
                          <Bell size={12} className="inline mr-1" />
                          ON
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">
                          <BellOff size={12} className="inline mr-1" />
                          OFF
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={sub.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={(e) => handleEdit(e, sub.id)}
                          variant="secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(sub.id);
                          }}
                          id={`duplicate-btn-${sub.id}`}
                          data-tutorial-target="duplicate-hint"
                          onMouseEnter={() => handleDuplicateHintTrigger(`duplicate-btn-${sub.id}`)}
                          onFocus={() => handleDuplicateHintTrigger(`duplicate-btn-${sub.id}`)}
                          onTouchStart={() => handleDuplicateHintTrigger(`duplicate-btn-${sub.id}`)}
                          variant="ghost"
                          size="sm"
                          className="border border-dashed border-gray-300 dark:border-dark-border"
                        >
                          Duplicate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isBulkEditOpen && (
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          selectedCount={selectedVisibleIds.length}
          onSave={handleBulkEditSave}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isDuplicateHintOpen && duplicateHintSteps.length > 0 && (
        <InteractiveTutorial
          steps={duplicateHintSteps}
          isOpen={isDuplicateHintOpen}
          currentStepIndex={0}
          onClose={handleDuplicateHintClose}
          onNext={handleDuplicateHintNext}
          onPrev={handleDuplicateHintPrev}
          onSkip={handleDuplicateHintSkip}
        />
      )}
    </PullToRefresh>
  );
}
