import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Bell, BellOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Subscription, Category, BillingCycle } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatDate, formatBillingCycle } from '../utils/format';

export default function Subscriptions() {
  const navigate = useNavigate();
  const { subscriptions, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCycle, setFilterCycle] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const currency = user?.currencyPreference || '₹';

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || sub.category === filterCategory;
      const matchesCycle = filterCycle === 'all' || sub.billingCycle === filterCycle;
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesCycle && matchesStatus;
    });
  }, [subscriptions, searchQuery, filterCategory, filterCycle, filterStatus]);

  const handleRowClick = (id: string) => {
    navigate(`/subscription/${id}`);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/edit/${id}`);
  };

  if (subscriptions.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">All Subscriptions</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary mt-1">Manage all your recurring payments</p>
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">All Subscriptions</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          </p>
        </div>
        <Button onClick={() => navigate('/add')} variant="primary">
          <PlusCircle size={20} className="inline mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
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
            value={filterCycle}
            onChange={(e) => setFilterCycle(e.target.value)}
            options={[
              { value: 'all', label: 'All Cycles' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Annual' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      {filteredSubscriptions.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-12">
          <EmptyState
            icon={<Search size={32} />}
            title="No matches found"
            description="Try adjusting your filters or search query."
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-surface-hover border-b border-gray-200 dark:border-dark-border">
                <tr>
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
                {filteredSubscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => handleRowClick(sub.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface-hover transition-colors"
                  >
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
                      <Button
                        onClick={(e) => handleEdit(e, sub.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

