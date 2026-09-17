// src/pages/admin/AdminAppointments.jsx
import { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { getBookings, saveBooking } from '../../utils/storage';
import { formatDate, formatTime, formatPrice } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';

const STATUS_MAP = {
  confirmed: 'badge-green',
  completed: 'badge-blue',
  pending: 'badge-amber',
  cancelled: 'badge-red',
};

const SAMPLE = [
  { id: 'AURA-2026-0917-1001', service: { name: 'Signature Haircut', price: 500, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=100&q=80' }, specialist: { name: 'Ananya Nair' }, date: '2026-09-17', time: '09:30', customer: { name: 'Priya R.', phone: '9876543210' }, status: 'confirmed' },
  { id: 'AURA-2026-0917-1002', service: { name: 'Indian Head Massage', price: 600, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&q=80' }, specialist: { name: 'Riya Thomas' }, date: '2026-09-17', time: '10:30', customer: { name: 'Rahul M.', phone: '9876543211' }, status: 'confirmed' },
  { id: 'AURA-2026-0917-1003', service: { name: 'Classic Facial', price: 1000, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&q=80' }, specialist: { name: 'Meera Krishnan' }, date: '2026-09-17', time: '11:00', customer: { name: 'Sana A.', phone: '9876543212' }, status: 'completed' },
  { id: 'AURA-2026-0918-1004', service: { name: 'HydraFacial', price: 2200, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&q=80' }, specialist: { name: 'Meera Krishnan' }, date: '2026-09-18', time: '12:00', customer: { name: 'Divya M.', phone: '9876543213' }, status: 'confirmed' },
  { id: 'AURA-2026-0918-1005', service: { name: 'Bridal Makeup', price: 5000, image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=100&q=80' }, specialist: { name: 'Diya Menon' }, date: '2026-09-18', time: '14:00', customer: { name: 'Anjali S.', phone: '9876543214' }, status: 'pending' },
];

function AppointmentModal({ booking, onClose, onUpdate }) {
  if (!booking) return null;
  return (
    <Modal isOpen={!!booking} onClose={onClose} title="Appointment Details">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <img src={booking.service?.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-aura-text dark:text-aura-dark-text">{booking.service?.name}</p>
            <p className="text-xs font-mono text-aura-muted dark:text-aura-dark-muted">{booking.id}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ['Customer', booking.customer?.name],
            ['Phone', booking.customer?.phone],
            ['Specialist', booking.specialist?.name],
            ['Date', formatDate(booking.date)],
            ['Time', formatTime(booking.time)],
            ['Amount', formatPrice(booking.service?.price || 0)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-aura-muted dark:text-aura-dark-muted">{k}</span>
              <span className="font-medium text-aura-text dark:text-aura-dark-text">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {booking.status !== 'completed' && (
            <button onClick={() => { onUpdate(booking.id, 'completed'); onClose(); }} className="btn-primary flex-1 justify-center text-xs py-2">
              <Check size={14} /> Mark Complete
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <button onClick={() => { onUpdate(booking.id, 'cancelled'); onClose(); }} className="flex-1 flex items-center justify-center gap-1 px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function AdminAppointments() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const stored = getBookings();
    setBookings(stored.length > 0 ? stored : SAMPLE);
  }, []);

  const handleUpdate = (id, status) => {
    setBookings((prev) => {
      const updated = prev.map((b) => b.id === id ? { ...b, status } : b);
      updated.forEach((b) => b.id === id && saveBooking(b));
      return updated;
    });
  };

  const filtered = statusFilter === 'All' ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Appointments</h1>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{bookings.length} total appointments</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['All', 'confirmed', 'pending', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? 'tab-btn-active capitalize' : 'tab-btn-inactive capitalize'}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aura-border dark:border-aura-dark-border">
              {['Customer', 'Service', 'Staff', 'Date', 'Time', 'Amount', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-border dark:divide-aura-dark-border">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-aura-surface2/50 dark:hover:bg-aura-dark-surface2/50 transition-colors">
                <td className="px-4 py-3 font-medium text-aura-text dark:text-aura-dark-text">{b.customer?.name}</td>
                <td className="px-4 py-3 text-aura-text dark:text-aura-dark-text">{b.service?.name}</td>
                <td className="px-4 py-3 text-aura-muted dark:text-aura-dark-muted">{b.specialist?.name}</td>
                <td className="px-4 py-3 text-aura-muted dark:text-aura-dark-muted">{formatDate(b.date)}</td>
                <td className="px-4 py-3 text-aura-muted dark:text-aura-dark-muted">{formatTime(b.time)}</td>
                <td className="px-4 py-3 font-medium text-aura-text dark:text-aura-dark-text">{formatPrice(b.service?.price || 0)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_MAP[b.status] || 'badge-green'} capitalize`}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setSelected(b)} className="p-1.5 rounded-lg hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted" title="View">
                      <Eye size={14} />
                    </button>
                    {b.status !== 'completed' && (
                      <button onClick={() => handleUpdate(b.id, 'completed')} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600" title="Complete">
                        <Check size={14} />
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button onClick={() => handleUpdate(b.id, 'cancelled')} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Cancel">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{b.service?.name}</p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{b.customer?.name} · {b.specialist?.name}</p>
              </div>
              <span className={`badge ${STATUS_MAP[b.status] || 'badge-green'} capitalize`}>{b.status}</span>
            </div>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted mb-3">{formatDate(b.date)} · {formatTime(b.time)} · {formatPrice(b.service?.price || 0)}</p>
            <div className="flex gap-2">
              <button onClick={() => setSelected(b)} className="btn-secondary text-xs flex-1 justify-center py-1.5">View</button>
              {b.status !== 'completed' && <button onClick={() => handleUpdate(b.id, 'completed')} className="btn-primary text-xs flex-1 justify-center py-1.5">Complete</button>}
              {b.status !== 'cancelled' && <button onClick={() => handleUpdate(b.id, 'cancelled')} className="text-xs flex-1 flex items-center justify-center py-1.5 border border-red-200 text-red-600 rounded-lg">Cancel</button>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-aura-muted dark:text-aura-dark-muted">
          <p className="text-3xl mb-3">📋</p>
          <p>No appointments in this category.</p>
        </div>
      )}

      <AppointmentModal booking={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
    </div>
  );
}
