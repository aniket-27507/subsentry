
import { useState, useRef } from 'react';
import { User, Bell, Globe, Trash2, Sun, Moon, DollarSign, Upload, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import BudgetCard from '../components/BudgetCard';
import BudgetSetupModal from '../components/BudgetSetupModal';
import { Budget } from '../types';
import { exportData, importData } from '../utils/data';


export default function Settings() {
  const {
    user,
    logout,
    setTheme: setUserTheme,
    budget,
    setBudget,
    updateBudget,
    deleteBudget,
    updateUserPreferences,
    getBudgetStatus,
    getDashboardMetrics,
    importState,
    subscriptions,
  } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [preferencesData, setPreferencesData] = useState({
    currency: user?.currencyPreference || '₹',
    timezone: user?.timezone || 'Asia/Kolkata',
    defaultReminderDays: user?.defaultReminderDays || 7,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - in real app would call API
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    setUserTheme(newTheme);
    setToastMessage(`Switched to ${newTheme} mode`);
    setShowToast(true);
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserPreferences({
        currencyPreference: preferencesData.currency,
        timezone: preferencesData.timezone,
        defaultReminderDays: preferencesData.defaultReminderDays,
      });
      setToastMessage('Preferences saved successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setToastMessage('Failed to save preferences. Please try again.');
      setShowToast(true);
    }
  };

  const handleDeleteAccount = () => {
    // Mock delete
    logout();
    window.location.href = '/';
  };

  const handleExportData = () => {
    exportData(user, subscriptions, budget);
    setToastMessage('Data export started.');
    setShowToast(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importData(file);
      importState(data);
      setToastMessage('Data imported successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to import data. Invalid file format.');
      setShowToast(true);
      console.error(error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveBudget = (data: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (budget) {
      updateBudget(data);
      setToastMessage('Budget updated successfully!');
    } else {
      setBudget(data);
      setToastMessage('Budget saved successfully!');
    }
    setShowToast(true);
    setIsBudgetModalOpen(false);
  };

  const handleDeleteBudget = () => {
    deleteBudget();
    setToastMessage('Budget removed.');
    setShowToast(true);
  };

  const budgetStatus = getBudgetStatus();
  const metrics = getDashboardMetrics();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Settings</h1>
        <p className="text-gray-600 dark:text-dark-text-secondary mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-primary dark:text-primary-dark" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Profile Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              placeholder="John Doe"
            />

            <Input
              type="email"
              label="Email Address"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              placeholder="you@example.com"
            />

            <Button type="submit" variant="primary">
              Save Profile
            </Button>
          </form>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {theme === 'dark' ? (
              <Moon size={24} className="text-primary-dark" />
            ) : (
              <Sun size={24} className="text-primary" />
            )}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
              Appearance
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
                Choose between light and dark mode to customize your viewing experience
              </p>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface-hover border border-gray-200 dark:border-dark-border rounded-lg">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon size={20} className="text-primary-dark" />
                  ) : (
                    <Sun size={20} className="text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-dark-text">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                      Currently active
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleThemeToggle}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gray-300 dark:bg-primary-dark"
                >
                  <span
                    className={`inline - block h - 4 w - 4 transform rounded - full bg - white transition - transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      } `}
                  />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget & Spending */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={24} className="text-primary dark:text-primary-dark" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Budget & Spending</h2>
          </div>

          {budget ? (
            <div className="space-y-4">
              <BudgetCard
                budgetStatus={budgetStatus}
                currency={budget.currency}
                alertThreshold={budget.alertThreshold}
                onEdit={() => setIsBudgetModalOpen(true)}
              />
              <Button variant="danger" onClick={handleDeleteBudget}>
                Remove Budget
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-gray-700 dark:text-dark-text">
                  Set monthly and annual budgets to unlock proactive alerts before you overspend.
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                  We'll compare your targets with actual spend every day.
                </p>
              </div>
              <Button onClick={() => setIsBudgetModalOpen(true)}>Create Budget</Button>
            </div>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={24} className="text-primary dark:text-primary-dark" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
              Default Reminder Settings
            </h2>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <Select
              label="Default Reminder Timing"
              value={preferencesData.defaultReminderDays.toString()}
              onChange={(e) =>
                setPreferencesData({
                  ...preferencesData,
                  defaultReminderDays: parseInt(e.target.value),
                })
              }
              options={[
                { value: '1', label: '1 day before renewal' },
                { value: '3', label: '3 days before renewal' },
                { value: '7', label: '7 days before renewal' },
                { value: '14', label: '14 days before renewal' },
                { value: '30', label: '30 days before renewal' },
              ]}
              helperText="This will be applied to new subscriptions by default"
            />

            <div className="bg-gray-50 dark:bg-dark-surface-hover border border-gray-200 dark:border-dark-border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Notification Channels</h3>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-3">
                Choose how you want to receive renewal reminders
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked
                    className="w-4 h-4 text-primary dark:text-primary-dark rounded"
                    readOnly
                  />
                  <span className="text-sm text-gray-700 dark:text-dark-text-secondary">Email notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 text-primary dark:text-primary-dark rounded"
                  />
                  <span className="text-sm text-gray-400 dark:text-dark-text-secondary">
                    In-app notifications (Coming soon)
                  </span>
                </label>
              </div>
            </div>

            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </form>
        </Card>

        {/* Regional Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={24} className="text-primary dark:text-primary-dark" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Regional Settings</h2>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <Select
              label="Currency"
              value={preferencesData.currency}
              onChange={(e) =>
                setPreferencesData({ ...preferencesData, currency: e.target.value })
              }
              options={[
                { value: '₹', label: '₹ Indian Rupee (INR)' },
                { value: '$', label: '$ US Dollar (USD)' },
                { value: '€', label: '€ Euro (EUR)' },
                { value: '£', label: '£ British Pound (GBP)' },
              ]}
            />

            <Select
              label="Time Zone"
              value={preferencesData.timezone}
              onChange={(e) =>
                setPreferencesData({ ...preferencesData, timezone: e.target.value })
              }
              options={[
                { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                { value: 'America/New_York', label: 'America/New_York (EST)' },
                { value: 'Europe/London', label: 'Europe/London (GMT)' },
                { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
              ]}
            />

            <Button type="submit" variant="primary">
              Save Settings
            </Button>
          </form>
        </Card>

        {/* Data & Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 size={24} className="text-primary dark:text-primary-dark" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Data & Privacy</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Export Your Data</h3>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-3">
                Download a copy of all your subscription data and settings
              </p>
              <div className="flex gap-3">
                <Button onClick={handleExportData} variant="secondary">
                  <Download size={18} className="mr-2 inline" />
                  Export Data
                </Button>
                <Button onClick={handleImportClick} variant="secondary">
                  <Upload size={18} className="mr-2 inline" />
                  Import Data
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
              <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2 text-danger dark:text-danger-dark">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-3">
                Permanently delete your account and all associated data. This action cannot
                be undone.
              </p>
              <Button onClick={() => setShowDeleteModal(true)} variant="danger">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        footer={
          <>
            <Button onClick={() => setShowDeleteModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} variant="danger">
              Yes, Delete My Account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-dark-text-secondary">
            Are you sure you want to delete your account? This will permanently remove:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-dark-text-secondary space-y-1">
            <li>All your subscription data</li>
            <li>Reminder preferences</li>
            <li>Account settings</li>
            <li>Historical insights</li>
          </ul>
          <p className="text-danger dark:text-danger-dark font-medium">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

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
    </div>
  );
}

