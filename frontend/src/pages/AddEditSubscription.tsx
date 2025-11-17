import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Category, PaymentMethod } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';
import Toast from '../components/Toast';

export default function AddEditSubscription() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addSubscription, updateSubscription, getSubscriptionById, user } = useStore();
  
  const isEdit = Boolean(id);
  const existingSubscription = id ? getSubscriptionById(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Streaming' as Category,
    amount: '',
    currency: user?.currencyPreference || '₹',
    billingCycle: 'monthly' as 'monthly' | 'annual' | 'custom',
    firstPaymentDate: '',
    nextRenewalDate: '',
    paymentMethod: 'Credit Card' as PaymentMethod,
    notes: '',
    reminderEnabled: true,
    reminderDaysBefore: 7,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isEdit && existingSubscription) {
      setFormData({
        name: existingSubscription.name,
        category: existingSubscription.category,
        amount: existingSubscription.amount.toString(),
        currency: existingSubscription.currency,
        billingCycle: existingSubscription.billingCycle,
        firstPaymentDate: existingSubscription.firstPaymentDate,
        nextRenewalDate: existingSubscription.nextRenewalDate,
        paymentMethod: existingSubscription.paymentMethod,
        notes: existingSubscription.notes,
        reminderEnabled: existingSubscription.reminderEnabled,
        reminderDaysBefore: existingSubscription.reminderDaysBefore,
      });
    }
  }, [isEdit, existingSubscription]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Subscription name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.nextRenewalDate) newErrors.nextRenewalDate = 'Next renewal date is required';
    if (!formData.firstPaymentDate) newErrors.firstPaymentDate = 'First payment date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const subscriptionData = {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      billingCycle: formData.billingCycle,
      firstPaymentDate: formData.firstPaymentDate,
      nextRenewalDate: formData.nextRenewalDate,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      status: 'active' as const,
      reminderEnabled: formData.reminderEnabled,
      reminderDaysBefore: formData.reminderDaysBefore,
    };

    if (isEdit && id) {
      updateSubscription(id, subscriptionData);
    } else {
      addSubscription(subscriptionData);
    }

    setShowToast(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors text-gray-900 dark:text-dark-text"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
            {isEdit ? 'Edit Subscription' : 'Add New Subscription'}
          </h1>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            {isEdit
              ? 'Update your subscription details'
              : 'Log a new recurring payment to track'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-8">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Subscription Name"
                    placeholder="e.g., Netflix Premium"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                </div>

                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  options={[
                    { value: 'Streaming', label: 'Streaming' },
                    { value: 'SaaS', label: 'SaaS' },
                    { value: 'Fitness', label: 'Fitness' },
                    { value: 'Utilities', label: 'Utilities' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  required
                />

                <Select
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  options={[
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'Debit Card', label: 'Debit Card' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  required
                />
              </div>
            </div>

            {/* Billing Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                Billing Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Amount"
                  placeholder="649"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  error={errors.amount}
                  helperText={`Amount in ${formData.currency}`}
                  required
                />

                <Select
                  label="Billing Cycle"
                  value={formData.billingCycle}
                  onChange={(e) => handleChange('billingCycle', e.target.value)}
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'annual', label: 'Annual' },
                    { value: 'custom', label: 'Custom' },
                  ]}
                  required
                />

                <Input
                  type="date"
                  label="First Payment Date"
                  value={formData.firstPaymentDate}
                  onChange={(e) => handleChange('firstPaymentDate', e.target.value)}
                  error={errors.firstPaymentDate}
                  helperText="When did you first subscribe?"
                  required
                />

                <Input
                  type="date"
                  label="Next Renewal Date"
                  value={formData.nextRenewalDate}
                  onChange={(e) => handleChange('nextRenewalDate', e.target.value)}
                  error={errors.nextRenewalDate}
                  helperText="When will you be charged next?"
                  required
                />
              </div>
            </div>

            {/* Reminder Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                Reminder Preferences
              </h2>
              <div className="space-y-4">
                <Toggle
                  checked={formData.reminderEnabled}
                  onChange={(checked) => handleChange('reminderEnabled', checked)}
                  label="Enable pre-renewal reminder"
                />
                
                {formData.reminderEnabled && (
                  <Select
                    label="Remind me before"
                    value={formData.reminderDaysBefore.toString()}
                    onChange={(e) => handleChange('reminderDaysBefore', parseInt(e.target.value))}
                    options={[
                      { value: '1', label: '1 day before' },
                      { value: '3', label: '3 days before' },
                      { value: '7', label: '7 days before' },
                      { value: '14', label: '14 days before' },
                      { value: '30', label: '30 days before' },
                    ]}
                  />
                )}
                
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  We'll email you before each renewal so you can decide: keep it, cancel it, or
                  adjust your plan. Avoid surprise charges by keeping this reminder on.
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label="Notes (Optional)"
                placeholder="Add any notes about this subscription..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button type="submit" variant="primary">
            <Save size={20} className="inline mr-2" />
            {isEdit ? 'Save Changes' : 'Add Subscription'}
          </Button>
          <Button type="button" onClick={() => navigate(-1)} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>

      {/* Success Toast */}
      {showToast && (
        <Toast
          message={
            isEdit
              ? 'Subscription updated successfully!'
              : "Nice catch - that renewal won't surprise you now."
          }
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

