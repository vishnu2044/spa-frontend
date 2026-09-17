// src/data/offers.js

// Weekend offer end time: next Sunday at midnight
function getNextSunday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(23, 59, 59, 0);
  return next.toISOString();
}

export const offers = [
  {
    id: 'weekday-spa',
    title: 'Weekday Spa Special',
    label: 'THIS WEEK',
    description: 'Enjoy 20% off all spa treatments from Monday to Thursday. Treat yourself mid-week.',
    discount: '20% OFF',
    discountType: 'percentage',
    discountValue: 20,
    category: 'Spa',
    validDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    code: 'MIDWEEK20',
    featured: false,
    hasCountdown: false,
    color: 'green',
  },
  {
    id: 'weekend-glow',
    title: 'Weekend Glow Offer',
    label: 'LIMITED TIME',
    description: '20% off selected skin and hair treatments this weekend only. Book before the offer ends!',
    discount: '20% OFF',
    discountType: 'percentage',
    discountValue: 20,
    category: 'Skin',
    validDays: ['Saturday', 'Sunday'],
    code: 'GLOW20',
    featured: true,
    hasCountdown: true,
    endTime: getNextSunday(),
    color: 'amber',
  },
  {
    id: 'refer-friend',
    title: 'Refer & Glow',
    label: 'ALWAYS ON',
    description: 'Refer a friend to Aura Wellness and receive ₹300 off your next service when they book.',
    discount: '₹300 OFF',
    discountType: 'flat',
    discountValue: 300,
    category: 'All',
    code: 'REFERAURA',
    featured: false,
    hasCountdown: false,
    color: 'teal',
  },
  {
    id: 'new-client',
    title: 'First Visit Offer',
    label: 'NEW CLIENTS',
    description: 'First time at Aura? Enjoy a complimentary scalp massage with any hair service on your first visit.',
    discount: 'FREE GIFT',
    discountType: 'gift',
    discountValue: 0,
    category: 'Hair',
    code: 'FIRST',
    featured: false,
    hasCountdown: false,
    color: 'rose',
  },
];

export const membershipPlans = [
  {
    id: 'basic',
    name: 'Aura Basic',
    price: 499,
    period: '/month',
    color: 'slate',
    description: 'A great way to start your wellness journey.',
    benefits: [
      '5% service discount',
      'Birthday treat',
      'Priority booking',
      'Member newsletter',
    ],
  },
  {
    id: 'plus',
    name: 'Aura Plus',
    price: 999,
    period: '/month',
    color: 'amber',
    description: 'For the regular wellness enthusiast.',
    benefits: [
      '10% service discount',
      'Monthly spa session',
      'Birthday treatment',
      'Priority booking',
      'Exclusive member offers',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Aura Premium',
    price: 1999,
    period: '/month',
    color: 'emerald',
    description: 'Total wellness, without compromise.',
    benefits: [
      '15% service discount',
      'Monthly facial',
      'Monthly spa session',
      'Priority booking',
      'Exclusive offers',
      'Complimentary birthday full package',
    ],
  },
];
