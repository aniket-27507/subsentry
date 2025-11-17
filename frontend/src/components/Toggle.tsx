interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            checked ? 'bg-primary dark:bg-primary-dark' : 'bg-gray-300 dark:bg-dark-border'
          }`}
        />
        <div
          className={`absolute left-1 top-1 bg-white dark:bg-dark-text w-4 h-4 rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">{label}</span>
      )}
    </label>
  );
}

