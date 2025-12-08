import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Bell, BellOff, Calendar, Slash } from 'lucide-react';
import { useStore } from '../store/useStore';
import CancelHelperModal from '../components/CancelHelperModal';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { formatCurrency, formatDate, formatBillingCycle, getDaysUntil } from '../utils/format';

export default function SubscriptionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSubscriptionById, updateSubscription, deleteSubscription, user } = useStore();
  
  const subscription = id ? getSubscriptionById(id) : null;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelHelperModal, setShowCancelHelperModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const currency = user?.currencyPreference || '₹';

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Not Found</h2>
        <Button onClick={() => navigate('/subscriptions')} variant="secondary">
          Back to Subscriptions
        </Button>
      </div>
    );
  }

  const daysUntilRenewal = getDaysUntil(subscription.nextRenewalDate);
  const monthlyEquivalent =
    subscription.billingCycle === 'monthly'
      ? subscription.amount
      : subscription.amount / 12;

  const handleToggleReminder = () => {
    updateSubscription(subscription.id, {
      reminderEnabled: !subscription.reminderEnabled,
    });
    setToastMessage(
      subscription.reminderEnabled
        ? 'Reminder turned off'
        : "Reminder turned on - you won't miss this renewal!"
    );
    setShowToast(true);
  };

  const handleCancelSubscription = () => {
    updateSubscription(subscription.id, { status: 'cancelled' });
    setShowDeleteModal(false);
    setToastMessage('Subscription marked as cancelled');
    setShowToast(true);
    setTimeout(() => navigate('/subscriptions'), 1500);
  };

  const handleDelete = () => {
    deleteSubscription(subscription.id);
    setShowDeleteModal(false);
    navigate('/subscriptions');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/subscriptions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subscription.name}</h1>
            <p className="text-gray-600 mt-1">Subscription Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/edit/${subscription.id}`)} variant="secondary">
            <Edit size={20} className="inline mr-2" />
            Edit
          </Button>
          <Button onClick={() => setShowDeleteModal(true)} variant="danger">
            <Trash2 size={20} className="inline mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(subscription.amount, currency)}
                </h2>
                <p className="text-gray-600 mt-1">
                  {formatBillingCycle(subscription.billingCycle)} billing
                </p>
              </div>
              <Badge
                variant={subscription.status === 'active' ? 'success' : 'default'}
                size="md"
              >
                {subscription.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-lg text-gray-900 mt-1">{subscription.category}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Method</p>
                <p className="text-lg text-gray-900 mt-1">{subscription.paymentMethod}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">First Payment</p>
                <p className="text-lg text-gray-900 mt-1">
                  {formatDate(subscription.firstPaymentDate)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Next Renewal</p>
                <p className="text-lg text-gray-900 mt-1">
                  {formatDate(subscription.nextRenewalDate)}
                </p>
              </div>

              {subscription.billingCycle === 'annual' && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Equivalent</p>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatCurrency(monthlyEquivalent, currency)}
                  </p>
                </div>
              )}
            </div>

            {subscription.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                <p className="text-gray-900">{subscription.notes}</p>
              </div>
            )}
          </Card>

          {/* Reminder Settings Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Renewal Reminder
                </h3>
                <p className="text-gray-600 mb-4">
                  {subscription.reminderEnabled
                    ? `You'll receive a reminder ${subscription.reminderDaysBefore} days before renewal.`
                    : "You won't receive a reminder before this subscription renews."}
                </p>
                <Toggle
                  checked={subscription.reminderEnabled}
                  onChange={handleToggleReminder}
                  label={subscription.reminderEnabled ? 'Reminder ON' : 'Reminder OFF'}
                />
                <p className="text-sm text-gray-500 mt-3">
                  Avoid surprise charges by keeping this reminder on.
                </p>
              </div>
              <div className="ml-4">
                {subscription.reminderEnabled ? (
                  <Bell size={32} className="text-success" />
                ) : (
                  <BellOff size={32} className="text-gray-400" />
                )}
              </div>
            </div>
          </Card>

          {/* Usage Nudge */}
          {subscription.status === 'active' && (
            <Card className="p-6 bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💡 Quick Check
              </h3>
              <p className="text-gray-700">
                Haven't used {subscription.name} lately? Consider whether it still earns
                its place in your budget. You're spending{' '}
                <strong>{formatCurrency(monthlyEquivalent, currency)}/month</strong> on this.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Renewal Alert */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Calendar size={24} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Next Renewal</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">
              {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Today'}
            </p>
            <p className="text-sm text-gray-600">
              Renews on {formatDate(subscription.nextRenewalDate)}
            </p>
            {daysUntilRenewal <= 7 && daysUntilRenewal > 0 && (
              <p className="text-sm text-warning font-medium mt-3">
                ⚠️ Renewal coming soon!
              </p>
            )}
          </Card>

          {/* Cost Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(monthlyEquivalent, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(
                    subscription.billingCycle === 'monthly'
                      ? subscription.amount * 12
                      : subscription.amount,
                    currency
                  )}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => navigate(`/edit/${subscription.id}`)}
                variant="secondary"
                fullWidth
              >
                <Edit size={18} className="inline mr-2" />
                Edit Details
              </Button>
              {subscription.status === 'active' && (
                <Button onClick={handleCancelSubscription} variant="secondary" fullWidth>
                  Mark as Cancelled
                </Button>
              )}
              {subscription.status === 'active' && (
                <Button
                  onClick={() => setShowCancelHelperModal(true)}
                  variant="secondary"
                  fullWidth
                >
                  <Slash size={18} className="inline mr-2" />
                  Help Me Cancel
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancellation Helper Modal */}
      {subscription && (
        <CancelHelperModal
          isOpen={showCancelHelperModal}
          onClose={() => setShowCancelHelperModal(false)}
          subscriptionName={subscription.name}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Subscription?"
        footer={
          <>
            <Button onClick={() => setShowDeleteModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger">
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{subscription.name}</strong>? This action
          cannot be undone.
        </p>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

