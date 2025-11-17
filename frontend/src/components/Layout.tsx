import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/subscriptions', icon: List, label: 'Subscriptions' },
    { to: '/add', icon: PlusCircle, label: 'Add Subscription' },
    { to: '/insights', icon: BarChart3, label: 'Insights' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">SubSentry</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">Subscription Tracker</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface-hover'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface-hover transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}

