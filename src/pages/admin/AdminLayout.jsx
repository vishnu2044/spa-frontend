// src/pages/admin/AdminLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Scissors, Users, Package, Star, Tag, Settings, Menu, X, ArrowLeft, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/staff', icon: Users, label: 'Staff' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/offers', icon: Tag, label: 'Offers' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-aura-bg dark:bg-aura-dark-bg pt-16">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-56 bg-aura-surface dark:bg-aura-dark-surface border-r border-aura-border dark:border-aura-dark-border z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-aura-border dark:border-aura-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-aura-accent">Admin Panel</p>
              <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-0.5">Aura Wellness</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-aura-muted dark:text-aura-dark-muted">
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
          {sidebarLinks.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-text dark:text-aura-dark-text'
                    : 'text-aura-muted dark:text-aura-dark-muted hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 hover:text-aura-text dark:hover:text-aura-dark-text'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-aura-border dark:border-aura-dark-border space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-xs text-aura-muted dark:text-aura-dark-muted hover:text-aura-text dark:hover:text-aura-dark-text w-full transition-colors"
          >
            <ArrowLeft size={14} /> Back to Website
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 w-full transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-56">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-aura-muted hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:bg-aura-dark-surface2"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">Admin Panel</p>
        </div>

        <div className="p-4 md:p-6 pb-24 md:pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
