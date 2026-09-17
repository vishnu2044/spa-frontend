// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { getBookings } from '../../utils/storage';
import { formatDate, formatTime, formatPrice } from '../../utils/helpers';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Add some sample bookings if none exist
    const stored = getBookings();
    if (stored.length === 0) {
      const samples = [
        { id: 'AURA-2026-0917-1001', service: { name: 'Signature Haircut', price: 500, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=100&q=80' }, specialist: { name: 'Ananya Nair' }, date: '2026-09-17', time: '09:30', customer: { name: 'Priya R.' }, status: 'confirmed' },
        { id: 'AURA-2026-0917-1002', service: { name: 'Indian Head Massage', price: 600, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&q=80' }, specialist: { name: 'Riya Thomas' }, date: '2026-09-17', time: '10:30', customer: { name: 'Rahul M.' }, status: 'confirmed' },
        { id: 'AURA-2026-0917-1003', service: { name: 'Classic Facial', price: 1000, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&q=80' }, specialist: { name: 'Meera Krishnan' }, date: '2026-09-17', time: '11:00', customer: { name: 'Sana A.' }, status: 'completed' },
        { id: 'AURA-2026-0917-1004', service: { name: 'HydraFacial', price: 2200, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&q=80' }, specialist: { name: 'Meera Krishnan' }, date: '2026-09-17', time: '12:00', customer: { name: 'Divya M.' }, status: 'completed' },
        { id: 'AURA-2026-0917-1005', service: { name: 'Bridal Makeup', price: 5000, image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=100&q=80' }, specialist: { name: 'Diya Menon' }, date: '2026-09-17', time: '14:00', customer: { name: 'Anjali S.' }, status: 'confirmed' },
        { id: 'AURA-2026-0917-1006', service: { name: 'Gel Manicure', price: 700, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=100&q=80' }, specialist: { name: 'Priya Chandran' }, date: '2026-09-17', time: '15:30', customer: { name: 'Nidhi P.' }, status: 'pending' },
        { id: 'AURA-2026-0917-1007', service: { name: 'Aromatherapy Massage', price: 1500, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=100&q=80' }, specialist: { name: 'Riya Thomas' }, date: '2026-09-17', time: '16:30', customer: { name: 'Reshma K.' }, status: 'confirmed' },
        { id: 'AURA-2026-0917-1008', service: { name: 'Hair Spa', price: 900, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80' }, specialist: { name: 'Ananya Nair' }, date: '2026-09-17', time: '17:00', customer: { name: 'Lakshmi V.' }, status: 'pending' },
      ];
      setBookings(samples);
    } else {
      setBookings(stored);
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === today || !b.date.startsWith('2026-09-1'));
  const allToday = bookings;
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
