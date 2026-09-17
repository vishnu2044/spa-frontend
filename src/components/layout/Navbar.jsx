// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/packages', label: 'Packages' },
  { to: '/offers', label: 'Offers' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-aura-dark-surface/95 backdrop-blur shadow-nav h-14'
            : 'bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border h-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none" aria-label="Aura Wellness Home">
            <span className="font-serif text-xl text-aura-text dark:text-aura-dark-text tracking-wide">
              AURA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-aura-accent font-medium uppercase">
              SALON · SPA · BEAUTY
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link-active px-3 py-1.5'
                    : 'nav-link px-3 py-1.5 rounded-lg hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:text-aura-dark-text dark:hover:bg-aura-dark-surface2 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/bookings"
              className="hidden md:flex p-2 rounded-lg text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:text-aura-dark-text dark:hover:bg-aura-dark-surface2 transition-colors"
              aria-label="My bookings"
            >
              <Calendar size={18} />
            </Link>

            <button
              onClick={() => navigate('/booking')}
              className="hidden md:flex btn-primary text-xs px-4 py-2"
              id="nav-book-btn"
            >
              Book Appointment
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:text-aura-dark-text dark:hover:bg-aura-dark-surface2 transition-colors"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden flex flex-col bg-aura-surface dark:bg-aura-dark-surface shadow-modal transition-transform duration-300 ${
          menuOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-aura-border dark:border-aura-dark-border">
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg text-aura-text dark:text-aura-dark-text">AURA</span>
            <span className="text-[8px] tracking-[0.25em] text-aura-accent font-medium uppercase">
              SALON · SPA · BEAUTY
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:bg-aura-dark-surface2 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-4" aria-label="Mobile navigation links">
          {[...navLinks, { to: '/bookings', label: 'My Bookings' }].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-text dark:text-aura-dark-text'
                    : 'text-aura-muted dark:text-aura-dark-muted hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 hover:text-aura-text dark:hover:text-aura-dark-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-aura-border dark:border-aura-dark-border space-y-2">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:text-aura-dark-text dark:hover:bg-aura-dark-surface2 transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link
            to="/booking"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full justify-center"
          >
            Book Appointment
          </Link>
        </div>
      </aside>
    </>
  );
}
