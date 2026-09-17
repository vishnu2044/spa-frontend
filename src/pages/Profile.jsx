// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Star, Clock, Calendar, ChevronRight, Award } from 'lucide-react';
import { getCustomer, saveCustomer, getRewards, getBookings } from '../utils/storage';
import { formatDate, formatPrice, isSameOrFuture } from '../utils/helpers';

const REWARDS_CATALOG = [
  { points: 500, label: '₹100 OFF', icon: '🎁' },
  { points: 1000, label: 'Free Head Massage', icon: '💆' },
  { points: 2000, label: '₹500 OFF', icon: '✨' },
];

export default function ProfilePage() {
  const [customer, setCustomer] = useState(null);
  const [rewards, setRewards] = useState({ points: 1250 });
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    setCustomer(getCustomer());
    setRewards(getRewards());
    setBookings(getBookings());
  }, []);

  if (!customer) return null;

  const upcoming = bookings.filter((b) => isSameOrFuture(b.date) && b.status !== 'cancelled').slice(0, 2);
  const past = bookings.filter((b) => !isSameOrFuture(b.date)).slice(0, 3);
  const nextReward = REWARDS_CATALOG.find((r) => r.points > rewards.points);
  const progress = nextReward ? (rewards.points / nextReward.points) * 100 : 100;

  const handleSave = () => {
    const updated = { ...customer, ...form };
    saveCustomer(updated);
    setCustomer(updated);
    setEditing(false);
  };

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile header */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-aura-green dark:bg-aura-dark-surface2 flex items-center justify-center text-2xl font-bold text-aura-accent flex-shrink-0">
            {customer.name[0] || 'G'}
          </div>
          <div className="flex-1">
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted mb-0.5">Welcome back</p>
            <h1 className="font-serif text-xl text-aura-text dark:text-aura-dark-text">{customer.name}</h1>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{customer.email || 'No email on file'}</p>
          </div>
          <button onClick={() => { setForm(customer); setEditing(true); }} className="btn-secondary text-xs">
            Edit
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="card p-5 space-y-4 animate-slide-up">
            <h2 className="font-semibold text-aura-text dark:text-aura-dark-text">Edit Profile</h2>
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field] || ''}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="input-field"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">Save</button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            </div>
          </div>
        )}

        {/* Upcoming appointment */}
        {upcoming.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-3">Upcoming Appointment</h2>
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl">
                <img src={b.service?.image} alt={b.service?.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{b.service?.name}</p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDate(b.date)}</p>
                </div>
                <Link to="/bookings" className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-aura-text">
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Rewards */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-aura-accent" />
              <h2 className="font-semibold text-aura-text dark:text-aura-dark-text">Aura Rewards</h2>
            </div>
            <span className="text-2xl font-bold text-aura-text dark:text-aura-dark-text">
              {rewards.points.toLocaleString()} pts
            </span>
          </div>

          {nextReward && (
            <>
              <div className="h-2 bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-aura-accent rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-aura-muted dark:text-aura-dark-muted mb-4">
                {nextReward.points - rewards.points} points until your next reward: {nextReward.label}
              </p>
            </>
          )}

          <div className="grid grid-cols-3 gap-2">
            {REWARDS_CATALOG.map((r) => (
              <div
                key={r.points}
                className={`text-center p-3 rounded-xl border ${
                  rewards.points >= r.points
                    ? 'border-aura-accent bg-aura-accent/5 dark:border-aura-accent-light'
                    : 'border-aura-border dark:border-aura-dark-border bg-aura-surface2 dark:bg-aura-dark-surface2'
                }`}
              >
                <p className="text-xl mb-1">{r.icon}</p>
                <p className="text-xs font-semibold text-aura-text dark:text-aura-dark-text">{r.label}</p>
                <p className="text-[10px] text-aura-muted dark:text-aura-dark-muted mt-0.5">{r.points} pts</p>
                {rewards.points >= r.points && (
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">Unlocked!</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-aura-border dark:border-aura-dark-border">
            <p className="text-xs font-semibold text-aura-muted dark:text-aura-dark-muted mb-2">Current Benefits</p>
            <ul className="space-y-1">
              {['Birthday reward', 'Priority booking', 'Member newsletter'].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
                  <span className="text-green-500">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Past visits */}
        {past.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-aura-text dark:text-aura-dark-text">Previous Visits</h2>
              <Link to="/bookings" className="text-xs text-aura-accent hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {past.map((b) => (
                <div key={b.id} className="flex items-center gap-3 text-sm">
                  <Clock size={14} className="text-aura-muted dark:text-aura-dark-muted flex-shrink-0" />
                  <span className="text-aura-text dark:text-aura-dark-text">{b.service?.name}</span>
                  <span className="text-aura-muted dark:text-aura-dark-muted ml-auto">{formatDate(b.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/booking" className="card p-4 text-center hover:shadow-card-hover transition-shadow">
            <Calendar size={20} className="text-aura-accent mx-auto mb-1.5" />
            <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">Book Now</p>
          </Link>
          <Link to="/offers" className="card p-4 text-center hover:shadow-card-hover transition-shadow">
            <Gift size={20} className="text-aura-accent mx-auto mb-1.5" />
            <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">View Offers</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
