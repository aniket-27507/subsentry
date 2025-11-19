import { ReactNode, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '../hooks/useIsMobile';
import Button from './Button';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex-col">
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
            <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white">
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
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isMobileNavOpen ? <X /> : <Menu />}
          </Button>
          <div className="text-center flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-dark-text-secondary">
              {location.pathname.replace('/', '') || 'home'}
            </p>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-dark-text">SubSentry</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center text-primary dark:text-primary-dark">
            <User size={18} />
          </div>
        </header>

        <main
          className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-bg"
          data-scroll-container
        >
          <div className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 pb-28 md:pb-10">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <div
            className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${isMobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border shadow-xl transform transition-transform duration-300 ${
              isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h2 className="text-2xl font-bold text-primary dark:text-primary-dark">SubSentry</h2>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">Stay in control</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setIsMobileNavOpen(false);
                    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                      window.navigator.vibrate(10);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    location.pathname.startsWith(item.to)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface-hover'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-gray-50 dark:bg-dark-surface-hover">
                <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </>
      )}

      {isMobile && <BottomNavigation items={navItems} />}
    </div>
  );
}

