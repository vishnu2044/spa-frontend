// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Camera, ExternalLink, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'Hair', to: '/services?cat=Hair' },
    { label: 'Skin', to: '/services?cat=Skin' },
    { label: 'Spa', to: '/services?cat=Spa' },
    { label: 'Nails', to: '/services?cat=Nails' },
    { label: 'Makeup', to: '/services?cat=Makeup' },
  ],
  Explore: [
    { label: 'Our Team', to: '/team' },
    { label: 'Packages', to: '/packages' },
    { label: 'Offers', to: '/offers' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Reviews', to: '/reviews' },
  ],
  Account: [
    { label: 'Book Appointment', to: '/booking' },
    { label: 'My Bookings', to: '/bookings' },
    { label: 'Profile', to: '/profile' },
    { label: 'Contact', to: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-aura-surface dark:bg-aura-dark-surface border-t border-aura-border dark:border-aura-dark-border pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="font-serif text-2xl text-aura-text dark:text-aura-dark-text leading-none">AURA</p>
              <p className="text-[9px] tracking-[0.25em] text-aura-accent font-medium uppercase mt-0.5">
                SALON · SPA · BEAUTY
              </p>
            </div>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-4 leading-relaxed max-w-xs">
              Beauty, wellness and time for yourself. Your trusted salon & spa experience in the heart of Calicut.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              <a
                href="https://maps.google.com/?q=Calicut,Kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
              >
                <MapPin size={14} />
                Calicut, Kerala
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
              >
                <Phone size={14} />
                +91 98765 43210
              </a>
              <a
                href="mailto:hello@aurawellness.in"
                className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
              >
                <Mail size={14} />
                hello@aurawellness.in
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
                aria-label="Facebook"
              >
                <ExternalLink size={16} />
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%20Aura%20Wellness%2C%20I%20would%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-aura-text dark:text-aura-dark-text mb-3">
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="py-6 border-t border-aura-border dark:border-aura-dark-border">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-aura-muted dark:text-aura-dark-muted">
            <span className="font-medium text-aura-text dark:text-aura-dark-text">Opening Hours</span>
            <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
            <span>Sunday: 10:00 AM – 6:00 PM</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-aura-border dark:border-aura-dark-border text-xs text-aura-muted dark:text-aura-dark-muted">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2026 Aura Wellness</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-aura-accent">Demo Website</span>
          </div>
          <span>
            Designed & Developed by{' '}
            <span className="text-aura-accent font-medium">ARUVI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
