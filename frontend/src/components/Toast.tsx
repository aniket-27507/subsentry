import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <AlertCircle size={20} />,
  };

  const colors = {
    success: 'bg-success dark:bg-success-dark text-white',
    error: 'bg-danger dark:bg-danger-dark text-white',
    warning: 'bg-warning dark:bg-warning-dark text-white',
    info: 'bg-gray-800 dark:bg-dark-surface text-white dark:text-dark-text',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${colors[type]} animate-slide-up z-50`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

