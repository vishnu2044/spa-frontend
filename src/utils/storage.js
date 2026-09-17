// src/utils/storage.js

const PREFIX = 'aura_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

// Booking helpers
export function getBookings() {
  return storage.get('bookings', []);
}

export function saveBooking(booking) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  storage.set('bookings', bookings);
  return bookings;
}

export function cancelBooking(bookingId) {
  const bookings = getBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } : b
  );
  storage.set('bookings', updated);
  return updated;
}

export function generateBookingId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `AURA-${year}-${month}${day}-${rand}`;
}

// Reviews
export function getReviews() {
  return storage.get('reviews', []);
}

export function saveReview(review) {
  const reviews = getReviews();
  reviews.unshift(review);
  storage.set('reviews', reviews);
  return reviews;
}

// Services (admin override)
export function getAdminServices() {
  return storage.get('admin_services', null);
}

export function saveAdminServices(services) {
  storage.set('admin_services', services);
}

// Staff (admin override)
export function getAdminStaff() {
  return storage.get('admin_staff', null);
}

export function saveAdminStaff(staff) {
  storage.set('admin_staff', staff);
}

// Theme
export function getTheme() {
  return storage.get('theme', 'light');
}

export function setTheme(theme) {
  storage.set('theme', theme);
}

// Customer / Profile
export function getCustomer() {
  return storage.get('customer', {
    name: 'Guest',
    email: '',
    phone: '',
    points: 1250,
    joinDate: '2026-01-15',
    membership: 'basic',
  });
}

export function saveCustomer(data) {
  storage.set('customer', data);
}

// Rewards
export function getRewards() {
  return storage.get('rewards', { points: 1250 });
}

export function addPoints(pts) {
  const r = getRewards();
  r.points += pts;
  storage.set('rewards', r);
  return r;
}

// Admin offers
export function getAdminOffers() {
  return storage.get('admin_offers', null);
}

export function saveAdminOffers(offers) {
  storage.set('admin_offers', offers);
}
