// src/components/layout/BottomBar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Scissors, Calendar, BookOpen, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const items = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/services', icon: Scissors, label: 'Services' },
  { to: '/bookings', icon: BookOpen, label: 'Bookings' },
  { to: '/contact', icon: MoreHorizontal, label: 'More' },
];

export default function BottomBar() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-aura-surface dark:bg-aura-dark-surface border-t border-aura-border dark:border-aura-dark-border safe-b"
      aria-label="Bottom navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center">
        {items.slice(0, 2).map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                isActive
                  ? 'text-aura-accent dark:text-aura-accent-light'
                  : 'text-aura-muted dark:text-aura-dark-muted'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Book CTA */}
        <div className="flex-1 flex items-center justify-center py-1.5">
          <button
            onClick={() => navigate('/booking')}
            id="mobile-book-btn"
            className="flex flex-col items-center gap-0.5 px-5 py-2 bg-aura-text dark:bg-aura-accent text-white rounded-xl text-xs font-semibold shadow-card hover:bg-aura-accent transition-colors"
            aria-label="Book appointment"
          >
            <Calendar size={18} />
            <span>Book</span>
          </button>
        </div>

        {items.slice(2).map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                isActive
                  ? 'text-aura-accent dark:text-aura-accent-light'
                  : 'text-aura-muted dark:text-aura-dark-muted'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
