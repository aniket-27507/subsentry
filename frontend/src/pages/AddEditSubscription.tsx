import { useState, useEffect, useMemo, FormEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, CopyPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Category, PaymentMethod, QuickAddSource, SubscriptionDraft } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';
import Toast from '../components/Toast';
import Badge from '../components/Badge';
import InteractiveTutorial, { TutorialStep } from '../components/InteractiveTutorial';
import { formatCurrency, formatShortDate } from '../utils/format';

const QUICK_ADD_TOUR_STORAGE_KEY = 'subsentry_quick_add_tour_seen';
const TEMPLATE_HINT_STORAGE_KEY = 'subsentry_micro_hint_template_drawer';

export default function AddEditSubscription() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    addSubscription,
    updateSubscription,
    getSubscriptionById,
    user,
    subscriptionTemplates,
    recentSubscriptions,
    subscriptionDraft,
    subscriptionDraftSource,
    clearSubscriptionDraft,
    buildDraftFromTemplate,
  } = useStore();
  
  const isEdit = Boolean(id);
  const existingSubscription = id ? getSubscriptionById(id) : null;
  const preferredCurrency = user?.currencyPreference || '₹';

  const mapDraftToFormState = (draft: SubscriptionDraft) => ({
    name: draft.name || '',
    category: draft.category,
    amount: Number.isFinite(draft.amount) ? draft.amount.toString() : '',
    currency: draft.currency,
    billingCycle: draft.billingCycle,
    firstPaymentDate: draft.firstPaymentDate || '',
    nextRenewalDate: draft.nextRenewalDate || '',
    paymentMethod: draft.paymentMethod,
    notes: draft.notes || '',
    reminderEnabled: draft.reminderEnabled,
    reminderDaysBefore: draft.reminderDaysBefore,
    status: 'active' as const,
  });

  const createInitialFormState = () => {
    if (isEdit && existingSubscription) {
      return {
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
        status: existingSubscription.status,
      };
    }

    if (!isEdit && subscriptionDraft) {
      return mapDraftToFormState(subscriptionDraft);
    }

    return {
      name: '',
      category: 'Streaming' as Category,
      amount: '',
      currency: preferredCurrency,
      billingCycle: 'monthly' as 'monthly' | 'annual' | 'custom',
      firstPaymentDate: '',
      nextRenewalDate: '',
      paymentMethod: 'Credit Card' as PaymentMethod,
      notes: '',
      reminderEnabled: true,
      reminderDaysBefore: user?.defaultReminderDays ?? 7,
      status: 'active' as const,
    };
  };

  const [formData, setFormData] = useState(createInitialFormState);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [templateQuery, setTemplateQuery] = useState('');
  const [quickAddSource, setQuickAddSource] = useState<QuickAddSource>(() =>
    !isEdit && subscriptionDraft ? subscriptionDraftSource : 'manual'
  );
  const [hasQuickTourBeenSeen, setHasQuickTourBeenSeen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(QUICK_ADD_TOUR_STORAGE_KEY) === 'true';
  });
  const [isQuickTourOpen, setIsQuickTourOpen] = useState(false);
  const [quickTourStep, setQuickTourStep] = useState(0);
  const [hasTemplateHintBeenSeen, setHasTemplateHintBeenSeen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(TEMPLATE_HINT_STORAGE_KEY) === 'true';
  });
  const [isTemplateHintOpen, setIsTemplateHintOpen] = useState(false);
  const [templateHintStep, setTemplateHintStep] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  const filteredTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();
    if (!query) {
      return subscriptionTemplates.slice(0, 8);
    }
    return subscriptionTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [subscriptionTemplates, templateQuery]);

  const recentEntries = useMemo(
    () => recentSubscriptions.slice(0, 6),
    [recentSubscriptions]
  );

  const quickAddSteps = useMemo<TutorialStep[]>(() => [
    {
      id: 'template-drawer',
      title: 'Start with a template',
      description:
        'Browse Netflix, Spotify, Prime and more to pre-fill the form with a single tap.',
      selector: '[data-tutorial-target="template-drawer"]',
    },
    {
      id: 'recent-strip',
      title: 'Re-add in seconds',
      description:
        'Recent subscriptions stay handy here so you can reuse their settings without retyping.',
      selector: '[data-tutorial-target="recent-strip"]',
    },
    {
      id: 'duplicate-hint',
      title: 'Duplicate from your list',
      description:
        'From the Subscriptions page tap “Duplicate” on any row to jump back here with everything ready.',
      selector: '[data-tutorial-target="duplicate-hint"]',
    },
  ], []);

  const templateHintSteps = useMemo<TutorialStep[]>(() => [
    {
      id: 'template-inline-hint',
      title: 'Templates pre-fill everything',
      description:
        'Pick Netflix, Spotify, Prime and more to drop their defaults straight into the form, then tweak anything you like.',
      selector: '[data-tutorial-target="template-drawer"]',
      placement: 'bottom',
    },
  ], []);

  const rememberQuickTour = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(QUICK_ADD_TOUR_STORAGE_KEY, 'true');
    }
    setHasQuickTourBeenSeen(true);
  };

  const markTemplateHintSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TEMPLATE_HINT_STORAGE_KEY, 'true');
    }
    setHasTemplateHintBeenSeen(true);
  }, []);

  const applyDraftToForm = (draft: SubscriptionDraft, source: QuickAddSource) => {
    setFormData(mapDraftToFormState(draft));
    setQuickAddSource(source);
    setErrors({});
  };

  useEffect(() => {
    if (!isEdit && subscriptionDraft) {
      clearSubscriptionDraft();
    }
  }, [isEdit, subscriptionDraft, clearSubscriptionDraft]);

  useEffect(() => {
    if (isEdit || hasQuickTourBeenSeen || user?.hasCompletedTutorial) return;
    const timer = window.setTimeout(() => {
      setQuickTourStep(0);
      setIsQuickTourOpen(true);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [hasQuickTourBeenSeen, user?.hasCompletedTutorial, isEdit]);

  useEffect(() => {
    if (
      isEdit ||
      !isTemplateDrawerOpen ||
      hasTemplateHintBeenSeen ||
      isTemplateHintOpen ||
      isQuickTourOpen
    ) {
      return;
    }
    const timer = window.setTimeout(() => {
      setTemplateHintStep(0);
      setIsTemplateHintOpen(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    isEdit,
    isTemplateDrawerOpen,
    hasTemplateHintBeenSeen,
    isTemplateHintOpen,
    isQuickTourOpen,
  ]);

  const handleQuickTourClose = (completed: boolean) => {
    void completed;
    rememberQuickTour();
    setIsQuickTourOpen(false);
  };

  const handleQuickTourSkip = () => {
    rememberQuickTour();
    setIsQuickTourOpen(false);
  };

  const handleQuickTourNext = () => {
    setQuickTourStep((prev) => Math.min(prev + 1, quickAddSteps.length - 1));
  };

  const handleQuickTourPrev = () => {
    setQuickTourStep((prev) => Math.max(prev - 1, 0));
  };

  const handleOpenQuickTour = () => {
    setQuickTourStep(0);
    setIsQuickTourOpen(true);
  };

  const handleTemplateHintClose = useCallback(() => {
    markTemplateHintSeen();
    setIsTemplateHintOpen(false);
  }, [markTemplateHintSeen]);

  const handleTemplateHintNext = () => {
    handleTemplateHintClose();
  };

  const handleTemplateHintPrev = () => {
    handleTemplateHintClose();
  };

  const handleTemplateHintSkip = () => {
    handleTemplateHintClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    const draft = buildDraftFromTemplate(templateId);
    if (!draft) return;
    applyDraftToForm(draft, 'template');
    setIsTemplateDrawerOpen(false);
  };

  const handleRecentSelect = (draft: SubscriptionDraft) => {
    applyDraftToForm(draft, 'recent');
  };

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
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
      status: formData.status,
      reminderEnabled: formData.reminderEnabled,
      reminderDaysBefore: formData.reminderDaysBefore,
    };

    if (isEdit && id) {
      updateSubscription(id, subscriptionData);
    } else {
      addSubscription(subscriptionData, { source: quickAddSource });
      setQuickAddSource('manual');
    }

    setShowToast(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-[240px]">
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
        {!isEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenQuickTour}
            className="border border-dashed border-primary/30 text-primary dark:text-primary-dark hover:border-primary"
          >
            <Sparkles size={16} className="mr-2" />
            Quick tips
          </Button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 sm:p-8">
          <div className="space-y-6">
            {!isEdit && (
              <div className="space-y-4">
                <div
                  className="border border-dashed border-gray-300 dark:border-dark-border rounded-xl p-4 sm:p-5 bg-gray-50 dark:bg-dark-surface-hover"
                  data-tutorial-target="template-drawer"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-dark-text-secondary">
                        Quick add library
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                        Start from a template
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                        Keep the dashboard uncluttered while still filling details in-line.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsTemplateDrawerOpen((prev) => !prev)}
                      className="w-full sm:w-auto"
                    >
                      {isTemplateDrawerOpen ? 'Hide templates' : 'Browse templates'}
                    </Button>
                  </div>

                  {isTemplateDrawerOpen && (
                    <div className="mt-4 space-y-4">
                      <Input
                        label="Search templates"
                        placeholder="Search Netflix, Spotify, Cult.fit..."
                        value={templateQuery}
                        onChange={(e) => setTemplateQuery(e.target.value)}
                      />
                      <div className="grid gap-3 md:grid-cols-2">
                        {filteredTemplates.length === 0 && (
                          <div className="col-span-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                            No templates match that search. Try another service.
                          </div>
                        )}
                        {filteredTemplates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => handleTemplateSelect(template.id)}
                            className="text-left p-4 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:border-primary dark:hover:border-primary-dark transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center text-2xl">
                                {template.icon}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                                    {template.name}
                                  </p>
                                  <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
                                    {template.defaultBillingCycle === 'annual' ? 'Annual' : 'Monthly'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                                  {template.description}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                                  {formatCurrency(template.suggestedAmount, template.currency)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                                  Typical {formatCurrency(template.priceRange.min, template.currency)} -{' '}
                                  {formatCurrency(template.priceRange.max, template.currency)}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {template.tags.map((tag) => (
                                    <span
                                      key={`${template.id}-${tag}`}
                                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text-secondary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-xl border border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 p-4"
                  data-tutorial-target="recent-strip"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">
                        Recent subscriptions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                        Reuse what you added lately and tweak the details.
                      </p>
                    </div>
                  </div>
                  {recentEntries.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                      Once you log a subscription we’ll keep a shortcut here for easy re-adds.
                    </p>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {recentEntries.map((recent) => (
                        <button
                          key={recent.id}
                          type="button"
                          onClick={() => handleRecentSelect(recent.draft)}
                          className="min-w-[220px] text-left p-4 border border-gray-200 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-surface hover:border-primary dark:hover:border-primary-dark transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-dark-text">
                                {recent.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                                {recent.category}
                              </p>
                            </div>
                            <Badge
                              variant={recent.source === 'template' ? 'info' : 'default'}
                              size="sm"
                            >
                              {recent.source === 'template'
                                ? 'Template'
                                : recent.source === 'duplicate'
                                ? 'Duplicate'
                                : recent.source === 'recent'
                                ? 'Recent'
                                : 'Manual'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2">
                            {formatCurrency(recent.draft.amount, recent.draft.currency)} {'• '}
                            {recent.draft.billingCycle === 'annual' ? 'Annual' : 'Monthly'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">
                            Last used {formatShortDate(recent.usedAt)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/80 dark:bg-amber-500/10 dark:border-amber-400 p-4"
                  data-tutorial-target="duplicate-hint"
                >
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-200 font-semibold">
                    <CopyPlus size={18} />
                    Duplicate from your list
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-100">
                    On the Subscriptions page tap “Duplicate” on any subscription to reopen this form with all
                    the details pre-filled. Make tiny edits instead of starting over.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="self-start"
                    onClick={() => navigate('/subscriptions')}
                  >
                    Go to subscriptions
                  </Button>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                Basic Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
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
                  onChange={(e) => handleChange('category', e.target.value as Category)}
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
                  onChange={(e) => handleChange('paymentMethod', e.target.value as PaymentMethod)}
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
              <div className="grid gap-4 md:grid-cols-2">
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
                  onChange={(e) =>
                    handleChange('billingCycle', e.target.value as 'monthly' | 'annual' | 'custom')
                  }
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
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button type="submit" variant="primary" className="flex-1 sm:flex-none">
            <Save size={20} className="inline mr-2" />
            {isEdit ? 'Save Changes' : 'Add Subscription'}
          </Button>
          <Button type="button" onClick={() => navigate(-1)} variant="secondary" className="flex-1 sm:flex-none">
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

      {isTemplateHintOpen && templateHintSteps.length > 0 && (
        <InteractiveTutorial
          steps={templateHintSteps}
          isOpen={isTemplateHintOpen}
          currentStepIndex={templateHintStep}
          onClose={handleTemplateHintClose}
          onNext={handleTemplateHintNext}
          onPrev={handleTemplateHintPrev}
          onSkip={handleTemplateHintSkip}
        />
      )}

      {!isEdit && quickAddSteps.length > 0 && (
        <InteractiveTutorial
          steps={quickAddSteps}
          isOpen={isQuickTourOpen}
          currentStepIndex={quickTourStep}
          onClose={handleQuickTourClose}
          onNext={handleQuickTourNext}
          onPrev={handleQuickTourPrev}
          onSkip={handleQuickTourSkip}
        />
      )}
    </div>
  );
}