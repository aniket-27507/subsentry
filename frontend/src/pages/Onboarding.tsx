import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Category } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Toggle from '../components/Toggle';

export default function Onboarding() {
  const navigate = useNavigate();
  const addSubscription = useStore((state) => state.addSubscription);
  const user = useStore((state) => state.user);
  const [step, setStep] = useState(1);
  type SubscriptionDraft = {
    name: string;
    category: Category;
    amount: string;
    billingCycle: 'monthly' | 'annual';
    nextRenewalDate: string;
    reminderEnabled: boolean;
  };

  const [subscriptions, setSubscriptions] = useState<SubscriptionDraft[]>([
    { name: '', category: 'Streaming', amount: '', billingCycle: 'monthly', nextRenewalDate: '', reminderEnabled: true },
  ]);

  const categories: Category[] = ['Streaming', 'SaaS', 'Fitness', 'Utilities', 'Other'];

  const handleAddMore = () => {
    setSubscriptions([
      ...subscriptions,
      { name: '', category: 'Streaming', amount: '', billingCycle: 'monthly', nextRenewalDate: '', reminderEnabled: true },
    ]);
  };

  const handleRemove = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const handleChange = <K extends keyof SubscriptionDraft>(
    index: number,
    field: K,
    value: SubscriptionDraft[K],
  ) => {
    const updated = [...subscriptions];
    updated[index] = { ...updated[index], [field]: value };
    setSubscriptions(updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Add all subscriptions to store
    subscriptions.forEach(sub => {
      if (sub.name && sub.amount && sub.nextRenewalDate) {
        addSubscription({
          name: sub.name,
          category: sub.category,
          amount: parseFloat(sub.amount),
          currency: user?.currencyPreference || '₹',
          billingCycle: sub.billingCycle,
          firstPaymentDate: sub.nextRenewalDate,
          nextRenewalDate: sub.nextRenewalDate,
          paymentMethod: 'Credit Card',
          notes: '',
          status: 'active',
          reminderEnabled: sub.reminderEnabled,
          reminderDaysBefore: 7,
        });
      }
    });
    
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                S
              </div>
              <span className="text-3xl font-bold text-primary">SubSentry</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's Conduct a Quick Audit
            </h1>
            <p className="text-gray-600">
              Find out what you're really spending each month on subscriptions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Which categories do you subscribe to?
            </h2>
            <p className="text-gray-600 mb-6">
              Select all that apply. We'll help you add specific subscriptions next.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <div
                  key={category}
                  className="p-4 border-2 border-primary bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <p className="font-medium text-gray-900">{category}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="primary" fullWidth>
                Continue
              </Button>
              <Button onClick={handleSkip} variant="secondary">
                Skip
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              S
            </div>
            <span className="text-3xl font-bold text-primary">SubSentry</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Your Top Subscriptions
          </h1>
          <p className="text-gray-600">
            Start with your biggest or most important subscriptions. You can add more later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {subscriptions.map((sub, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Subscription {index + 1}</h3>
                  {subscriptions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemove(index)}
                      variant="ghost"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Subscription Name"
                    placeholder="e.g., Netflix"
                    value={sub.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    required
                  />

                  <Select
                    label="Category"
                    value={sub.category}
                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                    options={categories.map(c => ({ value: c, label: c }))}
                    required
                  />

                  <Input
                    type="number"
                    label="Amount"
                    placeholder="649"
                    value={sub.amount}
                    onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    required
                  />

                  <Select
                    label="Billing Cycle"
                    value={sub.billingCycle}
                    onChange={(e) => handleChange(index, 'billingCycle', e.target.value)}
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'annual', label: 'Annual' },
                    ]}
                    required
                  />

                  <Input
                    type="date"
                    label="Next Renewal Date"
                    value={sub.nextRenewalDate}
                    onChange={(e) => handleChange(index, 'nextRenewalDate', e.target.value)}
                    helperText="When will you be charged next?"
                    required
                  />

                  <div className="flex items-center pt-8">
                    <Toggle
                      checked={sub.reminderEnabled}
                      onChange={(checked) => handleChange(index, 'reminderEnabled', checked)}
                      label="Remind me before renewal"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={handleAddMore}
              variant="secondary"
              fullWidth
            >
              + Add Another Subscription
            </Button>
          </div>

          <div className="flex gap-4 mt-8">
            <Button type="submit" variant="primary" fullWidth>
              <CheckCircle size={20} className="inline mr-2" />
              Complete Setup
            </Button>
            <Button type="button" onClick={handleSkip} variant="secondary">
              Skip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}




