// src/pages/Booking.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Clock, Star, Calendar, User } from 'lucide-react';
import { services, serviceCategories } from '../data/services';
import { staff } from '../data/staff';
import { formatPrice, formatDuration, formatDate, formatTime, getAvailableSlots, getCalendarAvailability } from '../utils/helpers';
import { saveBooking, addPoints, generateBookingId } from '../utils/storage';

const STEPS = ['Service', 'Specialist', 'Date', 'Time', 'Details', 'Confirm'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Step 1: Choose Service
function StepService({ value, onChange }) {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? services : services.filter((s) => s.category === cat);

  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-4">Choose your service</h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {serviceCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cat === c ? 'tab-btn-active' : 'tab-btn-inactive'}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((svc) => (
          <button
            key={svc.id}
            onClick={() => onChange(svc)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              value?.id === svc.id
                ? 'border-aura-accent bg-aura-accent/5 dark:border-aura-accent-light'
                : 'border-aura-border dark:border-aura-dark-border hover:border-aura-accent/40'
            }`}
          >
            <img src={svc.image} alt={svc.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{svc.name}</p>
              <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDuration(svc.duration)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{formatPrice(svc.price)}</p>
            </div>
            {value?.id === svc.id && (
              <div className="w-5 h-5 rounded-full bg-aura-accent flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2: Choose Specialist
function StepSpecialist({ service, value, onChange }) {
  const relevant = service?.category
    ? staff.filter((s) => s.categories.includes(service.category))
    : staff;

  const options = [
    { id: 'any', name: 'Any Available', role: 'We\'ll assign the best available specialist', image: null },
    ...relevant,
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-4">Choose your specialist</h2>
      <div className="space-y-2">
        {options.map((member) => (
          <button
            key={member.id}
            onClick={() => onChange(member)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              value?.id === member.id
                ? 'border-aura-accent bg-aura-accent/5 dark:border-aura-accent-light'
                : 'border-aura-border dark:border-aura-dark-border hover:border-aura-accent/40'
            }`}
          >
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-aura-green dark:bg-aura-dark-surface2 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-aura-accent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{member.name}</p>
              <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.role}</p>
              {member.rating && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.rating} · {member.reviews} reviews</span>
                </div>
              )}
            </div>
            {value?.id === member.id && (
              <div className="w-5 h-5 rounded-full bg-aura-accent flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Choose Date
function StepDate({ specialist, value, onChange }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const availability = getCalendarAvailability(year, month, specialist?.id || '');

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const handleSelect = (d) => {
    if (!d) return;
    const avail = availability[d];
    if (avail === 'past' || avail === 'fully-booked') return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(dateStr);
  };

  const selectedDay = value ? parseInt(value.split('-')[2]) : null;
  const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : null;
  const selectedYear = value ? parseInt(value.split('-')[0]) : null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-4">Choose a date</h2>

      {/* Calendar Nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 transition-colors">
          <ChevronLeft size={18} className="text-aura-muted dark:text-aura-dark-muted" />
        </button>
        <p className="font-semibold text-aura-text dark:text-aura-dark-text">
          {MONTHS[month]} {year}
        </p>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 transition-colors">
          <ChevronRight size={18} className="text-aura-muted dark:text-aura-dark-muted" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-aura-muted dark:text-aura-dark-muted py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const avail = availability[d];
          const isSelected = d === selectedDay && month === selectedMonth && year === selectedYear;
          const isPast = avail === 'past';
          const isFull = avail === 'fully-booked';
          const isLimited = avail === 'limited';

          return (
            <button
              key={i}
              onClick={() => handleSelect(d)}
              disabled={isPast || isFull}
              className={`relative h-9 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-aura-text dark:bg-aura-accent text-white'
                  : isPast || isFull
                  ? 'text-aura-border dark:text-aura-dark-border cursor-not-allowed'
                  : isLimited
                  ? 'text-amber-600 dark:text-amber-400 hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2'
                  : 'text-aura-text dark:text-aura-dark-text hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2'
              }`}
              aria-label={`${d} ${MONTHS[month]} – ${avail}`}
            >
              {d}
              {isLimited && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-aura-muted dark:text-aura-dark-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-aura-text dark:bg-aura-accent" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Limited
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-aura-border dark:bg-aura-dark-border" /> Unavailable
        </span>
      </div>
    </div>
  );
}

// Step 4: Choose Time
function StepTime({ date, specialist, value, onChange }) {
  const slots = getAvailableSlots(date, specialist?.id || 'any');
  const morning = slots.filter((s) => parseInt(s.time) < 12);
  const afternoon = slots.filter((s) => parseInt(s.time) >= 12);

  const SlotGroup = ({ title, slotList }) => (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted mb-2">{title}</p>
      <div className="grid grid-cols-4 gap-2">
        {slotList.map(({ time, available }) => (
          <button
            key={time}
            onClick={() => available && onChange(time)}
            disabled={!available}
            className={`py-2 px-1 rounded-lg text-sm font-medium text-center transition-all ${
              value === time
                ? 'bg-aura-text dark:bg-aura-accent text-white'
                : available
                ? 'border border-aura-border dark:border-aura-dark-border text-aura-text dark:text-aura-dark-text hover:border-aura-accent/50'
                : 'border border-aura-border dark:border-aura-dark-border text-aura-border dark:text-aura-dark-border cursor-not-allowed'
            }`}
            aria-label={`${formatTime(time)} – ${available ? 'available' : 'unavailable'}`}
          >
            {formatTime(time)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-1">Choose a time</h2>
      <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-4">{formatDate(date)}</p>
      <SlotGroup title="Morning" slotList={morning} />
      <SlotGroup title="Afternoon & Evening" slotList={afternoon} />
    </div>
  );
}

// Step 5: Customer Details
function StepDetails({ value, onChange }) {
  const [errors, setErrors] = useState({});

  const validate = (field, val) => {
    const errs = { ...errors };
    if (field === 'name') {
      if (!val.trim()) errs.name = 'Name is required';
      else delete errs.name;
    }
    if (field === 'phone') {
      if (!/^[6-9]\d{9}$/.test(val.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit Indian mobile number';
      else delete errs.phone;
    }
    if (field === 'email') {
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) errs.email = 'Enter a valid email address';
      else delete errs.email;
    }
    setErrors(errs);
  };

  const handle = (field) => (e) => {
    const val = e.target.value;
    onChange({ ...value, [field]: val });
    validate(field, val);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-4">Your details</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="booking-name">
            Full Name *
          </label>
          <input
            id="booking-name"
            type="text"
            placeholder="Your full name"
            value={value.name || ''}
            onChange={handle('name')}
            className="input-field"
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="booking-phone">
            Phone Number *
          </label>
          <input
            id="booking-phone"
            type="tel"
            placeholder="10-digit mobile number"
            value={value.phone || ''}
            onChange={handle('phone')}
            className="input-field"
            autoComplete="tel"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="booking-email">
            Email Address
          </label>
          <input
            id="booking-email"
            type="email"
            placeholder="your@email.com"
            value={value.email || ''}
            onChange={handle('email')}
            className="input-field"
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="booking-notes">
            Special Notes
          </label>
          <textarea
            id="booking-notes"
            placeholder="Any preferences, allergies or special requests…"
            value={value.notes || ''}
            onChange={handle('notes')}
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>
    </div>
  );
}

// Step 6: Confirm
function StepConfirm({ booking }) {
  const { service, specialist, date, time, customer } = booking;
  return (
    <div>
      <h2 className="text-lg font-semibold text-aura-text dark:text-aura-dark-text mb-4">Review your booking</h2>
      <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-2xl p-5 space-y-4 mb-5">
        <div className="flex items-center gap-3">
          <img src={service?.image} alt={service?.name} className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-aura-text dark:text-aura-dark-text">{service?.name}</p>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{formatDuration(service?.duration)}</p>
          </div>
          <p className="ml-auto font-semibold text-aura-text dark:text-aura-dark-text">{formatPrice(service?.price)}</p>
        </div>

        <div className="pt-4 border-t border-aura-border dark:border-aura-dark-border space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-aura-muted dark:text-aura-dark-muted">Specialist</span>
            <span className="font-medium text-aura-text dark:text-aura-dark-text">
              {specialist?.id === 'any' ? 'Any Available' : specialist?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-aura-muted dark:text-aura-dark-muted">Date</span>
            <span className="font-medium text-aura-text dark:text-aura-dark-text">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-aura-muted dark:text-aura-dark-muted">Time</span>
            <span className="font-medium text-aura-text dark:text-aura-dark-text">{formatTime(time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-aura-muted dark:text-aura-dark-muted">Name</span>
            <span className="font-medium text-aura-text dark:text-aura-dark-text">{customer?.name}</span>
          </div>
          {customer?.phone && (
            <div className="flex justify-between">
              <span className="text-aura-muted dark:text-aura-dark-muted">Phone</span>
              <span className="font-medium text-aura-text dark:text-aura-dark-text">{customer?.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Booking Success
function BookingSuccess({ bookingId, booking, onViewBookings, onBookAgain }) {
  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
        <Check size={28} className="text-green-600" />
      </div>
      <h2 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text mb-1">Appointment Confirmed!</h2>
      <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-6">
        Your appointment has been successfully booked.
      </p>

      <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-2xl p-5 text-left space-y-3 mb-6">
        <div className="text-center mb-2">
          <span className="text-xs font-mono font-bold tracking-widest text-aura-accent bg-aura-accent/10 px-3 py-1 rounded-full">
            {bookingId}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <img src={booking.service?.image} alt={booking.service?.name} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <p className="font-semibold text-sm text-aura-text dark:text-aura-dark-text">{booking.service?.name}</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDate(booking.date)} · {formatTime(booking.time)}</p>
          </div>
        </div>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted">
          Specialist: <span className="text-aura-text dark:text-aura-dark-text font-medium">
            {booking.specialist?.id === 'any' ? 'Any Available' : booking.specialist?.name}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <button onClick={onViewBookings} className="btn-primary w-full justify-center">View My Booking</button>
        <button onClick={onBookAgain} className="btn-secondary w-full justify-center">Book Another Appointment</button>
      </div>
    </div>
  );
}

// Progress indicator
function ProgressBar({ step, total, labels }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className={`progress-step ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-aura-text dark:bg-aura-accent text-white ring-2 ring-aura-accent/30'
                  : 'bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted'
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] hidden sm:block ${i === step ? 'text-aura-accent font-medium' : 'text-aura-muted dark:text-aura-dark-muted'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-full">
        <div
          className="h-full bg-aura-accent rounded-full transition-all duration-500"
          style={{ width: `${(step / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const [booking, setBooking] = useState({
    service: null,
    specialist: null,
    date: null,
    time: null,
    customer: { name: '', phone: '', email: '', notes: '' },
  });

  // Pre-select service from URL
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const svc = services.find((s) => s.id === serviceId);
      if (svc) {
        setBooking((b) => ({ ...b, service: svc }));
        setStep(1); // skip to specialist
      }
    }
  }, [searchParams]);

  const canProceed = () => {
    switch (step) {
      case 0: return !!booking.service;
      case 1: return !!booking.specialist;
      case 2: return !!booking.date;
      case 3: return !!booking.time;
      case 4: return !!(booking.customer.name?.trim() && /^[6-9]\d{9}$/.test(booking.customer.phone?.replace(/\s/g,'')));
      case 5: return true;
      default: return false;
    }
  };

  const handleConfirm = () => {
    const id = generateBookingId();
    setBookingId(id);
    const bookingData = {
      id,
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    saveBooking(bookingData);
    addPoints(100);
    setDone(true);
  };

  const reset = () => {
    setBooking({ service: null, specialist: null, date: null, time: null, customer: { name: '', phone: '', email: '', notes: '' } });
    setStep(0);
    setDone(false);
    setBookingId('');
  };

  if (done) {
    return (
      <main className="pt-16 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
        <div className="max-w-lg mx-auto px-4 py-8">
          <BookingSuccess
            bookingId={bookingId}
            booking={booking}
            onViewBookings={() => navigate('/bookings')}
            onBookAgain={reset}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="p-2 rounded-lg hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={20} className="text-aura-muted dark:text-aura-dark-muted" />
            </button>
          )}
          <div>
            <h1 className="font-serif text-xl text-aura-text dark:text-aura-dark-text">Book Appointment</h1>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar step={step} total={STEPS.length} labels={STEPS} />

        {/* Content */}
        <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-2xl border border-aura-border dark:border-aura-dark-border p-5 mb-4 animate-slide-up">
          {step === 0 && (
            <StepService
              value={booking.service}
              onChange={(svc) => { setBooking((b) => ({ ...b, service: svc })); setStep(1); }}
            />
          )}
          {step === 1 && (
            <StepSpecialist
              service={booking.service}
              value={booking.specialist}
              onChange={(sp) => { setBooking((b) => ({ ...b, specialist: sp })); setStep(2); }}
            />
          )}
          {step === 2 && (
            <StepDate
              specialist={booking.specialist}
              value={booking.date}
              onChange={(d) => setBooking((b) => ({ ...b, date: d }))}
            />
          )}
          {step === 3 && (
            <StepTime
              date={booking.date}
              specialist={booking.specialist}
              value={booking.time}
              onChange={(t) => setBooking((b) => ({ ...b, time: t }))}
            />
          )}
          {step === 4 && (
            <StepDetails
              value={booking.customer}
              onChange={(cust) => setBooking((b) => ({ ...b, customer: cust }))}
            />
          )}
          {step === 5 && <StepConfirm booking={booking} />}
        </div>

        {/* CTA */}
        {step >= 2 && (
          <button
            onClick={() => {
              if (!canProceed()) return;
              if (step === 5) handleConfirm();
              else setStep((s) => s + 1);
            }}
            disabled={!canProceed()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              canProceed()
                ? 'bg-aura-text dark:bg-aura-accent text-white hover:bg-aura-accent'
                : 'bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-border dark:text-aura-dark-border cursor-not-allowed'
            }`}
          >
            {step === 5 ? 'Confirm Appointment' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </main>
  );
}
