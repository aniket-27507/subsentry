import { Bell, BellOff, Edit3, ShieldCheck, Trash2 } from 'lucide-react';
import Button from './Button';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkCancel: () => void;
  onBulkToggleReminders: (enabled: boolean) => void;
  onBulkEdit: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkCancel,
  onBulkToggleReminders,
  onBulkEdit,
}: BulkActionsBarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 mb-4 border border-primary/20 dark:border-primary-dark/30 rounded-xl bg-primary/5 dark:bg-primary-dark/10">
      <div>
        <p className="text-sm font-medium text-primary dark:text-primary-dark">
          {selectedCount} {selectedCount === 1 ? 'subscription' : 'subscriptions'} selected
        </p>
        <div className="text-xs text-gray-600 dark:text-dark-text-secondary mt-1 flex gap-2">
          {!allSelected && totalCount > 0 && (
            <button
              className="underline hover:text-primary dark:hover:text-primary-dark"
              onClick={onSelectAll}
            >
              Select all {totalCount}
            </button>
          )}
          <button
            className="underline hover:text-primary dark:hover:text-primary-dark"
            onClick={onClearSelection}
          >
            Clear selection
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onBulkEdit} className="inline-flex items-center gap-2">
          <Edit3 size={16} />
          Bulk Edit
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onBulkToggleReminders(true)}
          className="inline-flex items-center gap-2"
        >
          <Bell size={16} />
          Reminders ON
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onBulkToggleReminders(false)}
          className="inline-flex items-center gap-2"
        >
          <BellOff size={16} />
          Reminders OFF
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onBulkCancel}
          className="inline-flex items-center gap-2"
        >
          <ShieldCheck size={16} />
          Mark Cancelled
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={onBulkDelete}
          className="inline-flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </div>
  );
}

