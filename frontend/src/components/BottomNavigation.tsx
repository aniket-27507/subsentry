import { LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
}

export default function BottomNavigation({ items }: BottomNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-dark-surface/95 border-t border-gray-200 dark:border-dark-border backdrop-blur-lg px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);

          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate(item.to)}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary dark:text-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                  : 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text'
              }`}
              aria-label={item.label}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


