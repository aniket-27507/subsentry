import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { Budget } from '../types';
import { formatCurrency } from '../utils/format';

interface BudgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  existingBudget?: Budget | null;
  currentSpending: { monthly: number; annual: number };
}

const currencyOptions = [
  { value: '₹', label: '₹ Indian Rupee (INR)' },
  { value: '$', label: '$ US Dollar (USD)' },
  { value: '€', label: '€ Euro (EUR)' },
  { value: '£', label: '£ British Pound (GBP)' },
];

export default function BudgetSetupModal({
  isOpen,
  onClose,
  onSave,
  existingBudget,
  currentSpending,
}: BudgetSetupModalProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(existingBudget?.monthlyBudget || 0);
  const [annualBudget, setAnnualBudget] = useState(existingBudget?.annualBudget || 0);
  const [alertThreshold, setAlertThreshold] = useState(existingBudget?.alertThreshold || 80);
  const [currency, setCurrency] = useState(existingBudget?.currency || '₹');

  const handleSave = () => {
    if (monthlyBudget <= 0 || annualBudget <= 0) return;
    onSave({
      monthlyBudget,
      annualBudget,
      alertThreshold,
      currency,
    });
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={monthlyBudget <= 0 || annualBudget <= 0}>
        Save Budget
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingBudget ? 'Edit Budget' : 'Set Budget'}
      footer={footer}
      size="md"
    >
      <div className="space-y-4">
        <Select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={currencyOptions}
        />

        <Input
          type="number"
          label="Monthly Budget"
          placeholder="e.g., 10000"
          min={0}
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(Number(e.target.value))}
          helperText={`Current spend: ${formatCurrency(currentSpending.monthly, currency)}/mo`}
          required
        />

        <Input
          type="number"
          label="Annual Budget"
          placeholder="e.g., 120000"
          min={0}
          value={annualBudget}
          onChange={(e) => setAnnualBudget(Number(e.target.value))}
          helperText={`Current spend: ${formatCurrency(currentSpending.annual, currency)}/yr`}
          required
        />

        <Input
          type="number"
          label="Alert Threshold (%)"
          min={50}
          max={100}
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(Number(e.target.value))}
          helperText="We'll warn you when you cross this percentage of your budget"
        />
      </div>
    </Modal>
  );
}

