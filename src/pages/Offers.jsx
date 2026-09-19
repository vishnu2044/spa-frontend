// src/pages/Offers.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Clock, Check, Crown } from 'lucide-react';
import { fetchOffers } from '../api/endpoints';
import { membershipPlans } from '../data/offers';
import Modal from '../components/ui/Modal';

// Countdown Timer component
function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(endTime) - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-3 mt-3" aria-label="Countdown timer" aria-live="polite">
      {timeLeft.d > 0 && (
        <div className="text-center">
          <div className="bg-aura-text dark:bg-aura-accent text-white text-lg font-bold w-12 h-12 rounded-xl flex items-center justify-center">
            {pad(timeLeft.d)}
          </div>
          <p className="text-[10px] text-aura-muted dark:text-aura-dark-muted mt-1">Days</p>
        </div>
      )}
      <div className="text-center">
        <div className="bg-aura-text dark:bg-aura-accent text-white text-lg font-bold w-12 h-12 rounded-xl flex items-center justify-center">
          {pad(timeLeft.h)}
        </div>
        <p className="text-[10px] text-aura-muted dark:text-aura-dark-muted mt-1">Hours</p>
      </div>
      <div className="text-aura-muted dark:text-aura-dark-muted font-bold text-xl">:</div>
      <div className="text-center">
        <div className="bg-aura-text dark:bg-aura-accent text-white text-lg font-bold w-12 h-12 rounded-xl flex items-center justify-center">
          {pad(timeLeft.m)}
        </div>
        <p className="text-[10px] text-aura-muted dark:text-aura-dark-muted mt-1">Min</p>
      </div>
      <div className="text-aura-muted dark:text-aura-dark-muted font-bold text-xl">:</div>
      <div className="text-center">
        <div className="bg-aura-text dark:bg-aura-accent text-white text-lg font-bold w-12 h-12 rounded-xl flex items-center justify-center">
          {pad(timeLeft.s)}
        </div>
        <p className="text-[10px] text-aura-muted dark:text-aura-dark-muted mt-1">Sec</p>
      </div>
    </div>
  );
}

const COLOR_BG = {
  green: 'bg-aura-green/40 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  teal: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
  rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
};

const PLAN_COLORS = {
  slate: 'border-slate-200 dark:border-slate-700',
  amber: 'border-amber-200 dark:border-amber-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
};

function MembershipModal({ plan, onClose }) {
  if (!plan) return null;
  return (
    <Modal isOpen={!!plan} onClose={onClose} title={`${plan.name} Membership`}>
      <div className="p-5 space-y-4">
        <div className="text-center py-4">
          <Crown size={32} className="text-aura-accent mx-auto mb-2" />
          <p className="text-3xl font-bold text-aura-text dark:text-aura-dark-text">
            ₹{plan.price.toLocaleString()}
          </p>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{plan.period}</p>
        </div>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted text-center">{plan.description}</p>
        <ul className="space-y-2">
          {plan.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
              <Check size={14} className="text-green-500" />
              {b}
            </li>
          ))}
        </ul>
        <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-3 text-center">
          <p className="text-xs text-aura-muted dark:text-aura-dark-muted">
            This is a demo membership — no payment required.
          </p>
        </div>
        <button onClick={onClose} className="btn-primary w-full justify-center">
          Select {plan.name}
        </button>
      </div>
    </Modal>
  );
}

export default function OffersPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffers();
        setOffers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  const featuredOffer = offers.find((o) => o.hasCountdown || o.has_countdown);
  const regularOffers = offers.filter((o) => !o.hasCountdown && !o.has_countdown);

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">OFFERS & MEMBERSHIP</p>
          <h1 className="section-heading">This week at Aura.</h1>
          <p className="section-subheading">Exclusive deals, promotions, and membership plans.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Featured countdown offer */}
        {featuredOffer && (
          <section aria-label="Featured limited time offer">
            <div className="bg-aura-text dark:bg-aura-dark-surface rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white" />
                <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-white" />
              </div>
              <div className="relative">
                <span className="text-xs font-bold tracking-widest text-aura-accent uppercase">
                  {featuredOffer.label}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl mt-2 mb-1">{featuredOffer.title}</h2>
                <p className="text-white/70 text-sm mb-4">{featuredOffer.description}</p>

                <p className="text-xs font-medium text-white/60 mb-1">Offer ends in:</p>
                <Countdown endTime={featuredOffer.endTime} />

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/booking')}
                    className="px-5 py-2.5 bg-aura-accent text-white rounded-xl text-sm font-semibold hover:bg-aura-accent-light transition-colors"
                  >
                    Claim Offer
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl">
                    <Tag size={14} />
                    <span className="text-sm font-mono font-bold">{featuredOffer.code}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular offers */}
        <section aria-label="Current offers">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-aura-muted dark:text-aura-dark-muted mb-4">
            Current Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularOffers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl border p-5 flex flex-col ${COLOR_BG[offer.color] || 'bg-aura-surface border-aura-border'}`}
              >
                <span className="label-tag mb-2">{offer.label}</span>
                <h3 className="font-semibold text-aura-text dark:text-aura-dark-text mb-1">{offer.title}</h3>
                <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed flex-1 mb-4">
                  {offer.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-aura-text dark:text-aura-dark-text">{offer.discount || offer.discount_label}</span>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-aura-surface/60 dark:bg-aura-dark-surface/60 rounded-lg">
                      <span className="text-xs font-mono font-bold text-aura-accent">{offer.code || offer.promo_code}</span>
                    </div>
                    <button
                      onClick={() => navigate('/booking')}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Membership */}
        <section aria-label="Membership plans">
          <div className="mb-5">
            <p className="label-tag mb-1">MEMBERSHIP</p>
            <h2 className="section-heading">Become an Aura Member.</h2>
            <p className="section-subheading">Exclusive discounts and benefits for loyal clients.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {membershipPlans.map((plan) => (
              <div
                key={plan.id}
                className={`card p-5 flex flex-col border-2 ${PLAN_COLORS[plan.color]} ${plan.popular ? 'ring-2 ring-aura-accent' : ''}`}
              >
                {plan.popular && (
                  <span className="badge badge-amber self-start mb-3">Most Popular</span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={16} className="text-aura-accent" />
                  <h3 className="font-semibold text-aura-text dark:text-aura-dark-text">{plan.name}</h3>
                </div>
                <p className="text-2xl font-bold text-aura-text dark:text-aura-dark-text mb-0.5">
                  ₹{plan.price.toLocaleString()}
                </p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted mb-4">{plan.period}</p>
                <ul className="space-y-1.5 flex-1 mb-5">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
                      <Check size={13} className="text-green-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setSelectedPlan(plan)} className="btn-primary text-xs w-full justify-center py-2.5">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MembershipModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </main>
  );
}
