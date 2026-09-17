// src/utils/helpers.js

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function isDatePast(dateStr) {
  return new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
}

export function isSameOrFuture(dateStr) {
  return !isDatePast(dateStr);
}

export function getStatusColor(status) {
  switch (status) {
    case 'confirmed': return 'green';
    case 'completed': return 'blue';
    case 'cancelled': return 'red';
    case 'pending': return 'amber';
    default: return 'slate';
  }
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateICS({ title, date, time, duration, location, description }) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + (duration || 60) * 60000);

  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aura Wellness//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@aura-wellness`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location || 'Aura Wellness, Calicut, Kerala'}`,
    `DESCRIPTION:${description || 'Appointment at Aura Wellness'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aura-appointment.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getAvailableSlots(date, staffId) {
  // Simulated availability based on date and staff
  const dayOfWeek = new Date(date).getDay();
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '13:00', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ];

  // Simulate some unavailable slots
  const hash = (date + staffId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return allSlots.map((slot, i) => ({
    time: slot,
    available: (hash + i) % 5 !== 0, // ~80% available
  }));
}

export function getCalendarAvailability(year, month, staffId = '') {
  const result = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date < today) {
      result[d] = 'past';
    } else {
      const hash = (year + month + d + (staffId || '').length) % 10;
      if (hash < 2) result[d] = 'fully-booked';
      else if (hash < 4) result[d] = 'limited';
      else result[d] = 'available';
    }
  }
  return result;
}
