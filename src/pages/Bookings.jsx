// src/pages/Bookings.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight, X, RotateCcw, CalendarPlus, ArrowRight } from 'lucide-react';
import { fetchMyBookings, cancelBooking as cancelBookingApi } from '../api/endpoints';
import { formatDate, formatTime, formatPrice, isDatePast, generateICS } from '../utils/helpers';
import Modal from '../components/ui/Modal';

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', cls: 'badge-green' },
  completed: { label: 'Completed', cls: 'badge-blue' },
  cancelled: { label: 'Cancelled', cls: 'badge-red' },
  pending: { label: 'Pending', cls: 'badge-amber' },
};

function BookingCard({ booking, onView }) {
  const isPast = isDatePast(booking.date);
  const status = booking.status || 'confirmed';

  return (
    <div
      className="card p-4 cursor-pointer hover:shadow-card-hover transition-shadow"
      onClick={() => onView(booking)}
      role="button"
      aria-label={`View booking ${booking.id}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView(booking)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <img
            src={booking.service?.image || booking.service?.image_url}
            alt={booking.service?.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{booking.service?.name}</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted font-mono">{booking.id}</p>
          </div>
        </div>
        <span className={`badge ${STATUS_MAP[status]?.cls || 'badge-green'}`}>
          {STATUS_MAP[status]?.label || 'Confirmed'}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-aura-muted dark:text-aura-dark-muted">
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {formatDate(booking.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {formatTime(booking.time)}
        </span>
        <span className="flex items-center gap-1">
          <User size={11} />
          {booking.specialist?.id === 'any' ? 'Any Available' : booking.specialist?.name}
        </span>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose, onCancel }) {
  if (!booking) return null;
  const status = booking.status || 'confirmed';
  const isPast = isDatePast(booking.date);
  const canCancel = status === 'confirmed' && !isPast;

  const handleICS = () => {
    generateICS({
      title: `Aura Wellness – ${booking.service?.name}`,
      date: booking.date,
      time: booking.time,
      duration: booking.service?.duration,
    });
  };

  return (
    <Modal isOpen={!!booking} onClose={onClose} title="Booking Details">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-widest text-aura-accent bg-aura-accent/10 px-3 py-1 rounded-full">
            {booking.id}
          </span>
          <span className={`badge ${STATUS_MAP[status]?.cls || 'badge-green'}`}>
            {STATUS_MAP[status]?.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <img src={booking.service?.image || booking.service?.image_url} alt={booking.service?.name} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-aura-text dark:text-aura-dark-text">{booking.service?.name}</p>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{formatPrice(booking.service?.price)}</p>
          </div>
        </div>

        <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-4 space-y-2.5 text-sm">
          {[
            ['Date', formatDate(booking.date)],
            ['Time', formatTime(booking.time)],
            ['Specialist', booking.specialist?.id === 'any' ? 'Any Available' : booking.specialist?.name],
            ['Customer', booking.customer?.name],
            ['Phone', booking.customer?.phone],
            booking.customer?.email && ['Email', booking.customer?.email],
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-aura-muted dark:text-aura-dark-muted">{k}</span>
              <span className="font-medium text-aura-text dark:text-aura-dark-text">{v}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {canCancel && (
            <button
              onClick={() => { onCancel(booking.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X size={16} /> Cancel Appointment
            </button>
          )}
          <button
            onClick={handleICS}
            className="btn-secondary w-full justify-center"
          >
            <CalendarPlus size={16} /> Add to Calendar
          </button>
          <Link
            to={`/booking?service=${booking.service?.id}`}
            onClick={onClose}
            className="btn-ghost w-full justify-center"
          >
            <RotateCcw size={16} /> Book Again
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await fetchMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBookingApi(id);
      loadBookings(); // reload list
    } catch (err) {
      console.error('Failed to cancel booking', err);
      alert('Failed to cancel booking');
    }
  };

  const upcoming = bookings.filter((b) => !isDatePast(b.booking_date || b.date) && b.status !== 'cancelled');
  const past = bookings.filter((b) => isDatePast(b.booking_date || b.date) || b.status === 'cancelled');

  if (loading) {
    return (
      <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg flex items-center justify-center">
        <div className="text-center px-4 text-aura-muted">Loading bookings...</div>
      </main>
    );
  }

  if (bookings.length === 0) {
    return (
      <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text mb-2">No appointments yet</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-6">Your upcoming appointments will appear here.</p>
          <Link to="/booking" className="btn-primary">
            Book an Appointment <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">My Bookings</h1>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{bookings.length} total</p>
          </div>
          <Link to="/booking" className="btn-primary text-xs">
            New Booking
          </Link>
        </div>

        {upcoming.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-aura-muted dark:text-aura-dark-muted mb-3">
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} onView={setSelected} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-aura-muted dark:text-aura-dark-muted mb-3">
              Past & Cancelled
            </h2>
            <div className="space-y-3 opacity-70">
              {past.map((b) => (
                <BookingCard key={b.id} booking={b} onView={setSelected} />
              ))}
            </div>
          </section>
        )}
      </div>

      <BookingDetailModal
        booking={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </main>
  );
}
