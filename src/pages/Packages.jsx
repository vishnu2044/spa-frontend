// src/pages/Packages.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Percent, ShoppingBag } from 'lucide-react';
import { fetchPackages, fetchServices } from '../api/endpoints';
import { formatPrice, formatDuration } from '../utils/helpers';
import Modal from '../components/ui/Modal';

const COLOR_MAP = {
  green: 'bg-aura-green/40 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
  teal: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
};

function PackageModal({ pkg, onClose, onBook }) {
  if (!pkg) return null;
  return (
    <Modal isOpen={!!pkg} onClose={onClose} title={`${pkg.name} Package`}>
      <div className="p-5 space-y-5">
        <img src={pkg.image} alt={pkg.name} className="w-full h-44 object-cover rounded-xl" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-aura-text dark:text-aura-dark-text">{formatPrice(pkg.price)}</p>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted line-through">{formatPrice(pkg.originalPrice)}</p>
          </div>
          <span className="badge badge-green">Save {formatPrice(pkg.saving)}</span>
        </div>

        <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed">{pkg.description}</p>

        <div>
          <h4 className="text-sm font-semibold text-aura-text dark:text-aura-dark-text mb-2">Included Services</h4>
          <ul className="space-y-1.5">
            {pkg.services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
                <Check size={14} className="text-green-500 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-aura-muted dark:text-aura-dark-muted">
          <Clock size={14} />
          Total duration: {formatDuration(pkg.duration)}
        </div>

        <button onClick={() => { onBook(pkg); onClose(); }} className="btn-primary w-full justify-center py-3">
          Book This Package
        </button>
      </div>
    </Modal>
  );
}

function PackageBuilder({ services = [] }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const chosenServices = services.filter((s) => selected.has(s.id));
  const total = chosenServices.reduce((acc, s) => acc + s.price, 0);
  const duration = chosenServices.reduce((acc, s) => acc + s.duration, 0);

  return (
    <section className="mt-14 bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-2xl p-6">
      <div className="mb-6">
        <p className="label-tag mb-1">Custom Package</p>
        <h2 className="section-heading">Build your self-care package.</h2>
        <p className="section-subheading">Select the treatments you want and we'll bundle them for you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {services.map((svc) => {
          const isSelected = selected.has(svc.id);
          return (
            <button
              key={svc.id}
              onClick={() => toggle(svc.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-aura-accent bg-aura-accent/5 dark:border-aura-accent-light'
                  : 'border-aura-border dark:border-aura-dark-border bg-aura-surface dark:bg-aura-dark-surface hover:border-aura-accent/40'
              }`}
              aria-pressed={isSelected}
            >
              <div>
                <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{svc.name}</p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDuration(svc.duration)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{formatPrice(svc.price)}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-aura-accent flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Selected</p>
            <p className="text-lg font-bold text-aura-text dark:text-aura-dark-text">{selected.size} services</p>
          </div>
          {selected.size > 0 && (
            <>
              <div>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Estimated Total</p>
                <p className="text-lg font-bold text-aura-text dark:text-aura-dark-text">{formatPrice(total)}</p>
              </div>
              <div>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Est. Duration</p>
                <p className="text-lg font-bold text-aura-text dark:text-aura-dark-text">{formatDuration(duration)}</p>
              </div>
            </>
          )}
        </div>
        <button
          disabled={selected.size === 0}
          onClick={() => navigate('/booking')}
          className={`btn-primary ${selected.size === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ShoppingBag size={16} />
          Book My Package
        </button>
      </div>
    </section>
  );
}

export default function PackagesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [packages, setPackages] = useState([]);
  const [buildableServices, setBuildableServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pkgs, svcs] = await Promise.all([
          fetchPackages(),
          fetchServices()
        ]);
        setPackages(Array.isArray(pkgs) ? pkgs : []);
        setBuildableServices((Array.isArray(svcs) ? svcs : []).filter(s => s.price < 2000).slice(0, 6)); // Just take some services for builder
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleBook = (pkg) => {
    navigate('/booking');
  };

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">PACKAGES</p>
          <h1 className="section-heading">Curated packages for every occasion.</h1>
          <p className="section-subheading">Save more when you bundle your favourite treatments.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl border p-5 flex flex-col ${COLOR_MAP[pkg.color] || 'bg-aura-surface border-aura-border'}`}
            >
              {pkg.popular && (
                <span className="badge badge-amber self-start mb-3">Most Popular</span>
              )}
              <h2 className="font-serif text-xl text-aura-text dark:text-aura-dark-text mb-0.5">{pkg.name}</h2>
              <p className="text-xs text-aura-muted dark:text-aura-dark-muted mb-4">{pkg.tagline}</p>

              <ul className="space-y-1.5 flex-1 mb-4">
                {(pkg.services || pkg.included_services || []).map((s) => (
                  <li key={s?.id || s} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
                    <Check size={13} className="text-green-500 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mb-4">
                <p className="text-2xl font-bold text-aura-text dark:text-aura-dark-text">{formatPrice(pkg.price)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted line-through">{formatPrice(pkg.originalPrice)}</p>
                  <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                    <Percent size={10} /> Save {formatPrice(pkg.saving)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => setSelected(pkg)} className="btn-secondary text-xs w-full justify-center py-2">
                  View Package
                </button>
                <button onClick={() => handleBook(pkg)} className="btn-primary text-xs w-full justify-center py-2">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <PackageBuilder services={buildableServices} />
      </div>

      <PackageModal pkg={selected} onClose={() => setSelected(null)} onBook={handleBook} />
    </main>
  );
}
