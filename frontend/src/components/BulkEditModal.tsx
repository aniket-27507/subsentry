import { useState } from 'react';
import Modal from './Modal';
import Select from './Select';
import Button from './Button';
import { Category, PaymentMethod } from '../types';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onSave: (updates: Partial<{ category: Category; paymentMethod: PaymentMethod }>) => void;
}

const categoryOptions: { value: Category; label: string }[] = [
  { value: 'Streaming', label: 'Streaming' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Other', label: 'Other' },
];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Other', label: 'Other' },
];

export default function BulkEditModal({
  isOpen,
  onClose,
  selectedCount,
  onSave,
}: BulkEditModalProps) {
  const [category, setCategory] = useState<Category | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');

  const handleSave = () => {
    const updates: Partial<{ category: Category; paymentMethod: PaymentMethod }> = {};
    if (category) updates.category = category;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    onSave(updates);
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={!category && !paymentMethod}>
        Apply Changes
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Edit Subscriptions" footer={footer}>
      <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-6">
        Update shared fields for <strong>{selectedCount}</strong>{' '}
        {selectedCount === 1 ? 'subscription' : 'subscriptions'} at once. Leave a field empty if you
        don't want to change it.
      </p>

      <div className="space-y-4">
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          options={[{ value: '', label: 'Keep existing category' }, ...categoryOptions]}
        />

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          options={[{ value: '', label: 'Keep existing payment method' }, ...paymentOptions]}
        />
      </div>
    </Modal>
  );
}

