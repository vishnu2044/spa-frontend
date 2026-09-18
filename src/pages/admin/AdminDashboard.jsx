// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { fetchAdminBookings } from '../../api/endpoints';
import { formatDate, formatTime, formatPrice } from '../../utils/helpers';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminBookings();
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to fetch admin bookings', err);
      }
    };
    loadData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const allToday = bookings.filter((b) => b.date === today || b.booking_date === today || !b.date); // or fallback
  const confirmed = allToday.filter((b) => b.status === 'confirmed');
  const completed = allToday.filter((b) => b.status === 'completed');
  const pending = allToday.filter((b) => b.status === 'pending');
  const revenue = allToday.reduce((acc, b) => acc + (b.service?.price || 0), 0);

  const stats = [
    { icon: Calendar, label: "Today's Appointments", value: allToday.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Clock, label: 'Pending', value: pending.length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { icon: CheckCircle, label: 'Completed', value: completed.length, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: DollarSign, label: 'Est. Revenue', value: formatPrice(revenue), color: 'text-aura-accent', bg: 'bg-aura-green dark:bg-green-900/20' },
  ];

  const STATUS_MAP = {
    confirmed: 'badge-green',
    completed: 'badge-blue',
    pending: 'badge-amber',
    cancelled: 'badge-red',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Dashboard</h1>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted">Today's overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xl font-bold text-aura-text dark:text-aura-dark-text">{value}</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-aura-border dark:border-aura-dark-border">
          <h2 className="font-semibold text-aura-text dark:text-aura-dark-text">Today's Schedule</h2>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-aura-border dark:border-aura-dark-border">
                {['Time', 'Specialist', 'Service', 'Customer', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-aura-border dark:divide-aura-dark-border">
              {allToday.map((b) => (
                <tr key={b.id} className="hover:bg-aura-surface2/50 dark:hover:bg-aura-dark-surface2/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-aura-text dark:text-aura-dark-text">{formatTime(b.time)}</td>
                  <td className="px-5 py-3 text-aura-text dark:text-aura-dark-text">{b.specialist?.name}</td>
                  <td className="px-5 py-3 text-aura-text dark:text-aura-dark-text">{b.service?.name}</td>
                  <td className="px-5 py-3 text-aura-muted dark:text-aura-dark-muted">{b.customer?.name}</td>
                  <td className="px-5 py-3 font-medium text-aura-text dark:text-aura-dark-text">{formatPrice(b.service?.price || 0)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${STATUS_MAP[b.status] || 'badge-green'} capitalize`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-aura-border dark:divide-aura-dark-border">
          {allToday.map((b) => (
            <div key={b.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{b.service?.name}</p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{b.customer?.name} · {b.specialist?.name}</p>
                </div>
                <span className={`badge ${STATUS_MAP[b.status] || 'badge-green'} capitalize`}>{b.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-aura-muted dark:text-aura-dark-muted">
                <span>{formatTime(b.time)}</span>
                <span>{formatPrice(b.service?.price || 0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
