// src/pages/Services.jsx
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, X, Clock, ChevronRight, Check } from 'lucide-react';
import { services, serviceCategories } from '../data/services';
import { formatPrice, formatDuration } from '../utils/helpers';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import StarRating from '../components/ui/StarRating';
import { SkeletonRow } from '../components/ui/Skeleton';

function ServiceModal({ service, onClose, onBook }) {
  if (!service) return null;
  return (
    <Modal isOpen={!!service} onClose={onClose} title={service.name} size="md">
      <div className="p-5 space-y-5">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-aura-text dark:text-aura-dark-text">
              {formatPrice(service.price)}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-aura-muted dark:text-aura-dark-muted mt-0.5">
              <Clock size={13} />
              {formatDuration(service.duration)}
            </div>
          </div>
          <span className="badge badge-green">{service.category}</span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-aura-text dark:text-aura-dark-text mb-1.5">About this service</h3>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed">{service.description}</p>
        </div>

        {service.benefits?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-aura-text dark:text-aura-dark-text mb-2">Benefits</h3>
            <ul className="space-y-1.5">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-aura-muted dark:text-aura-dark-muted">
                  <Check size={14} className="text-green-500 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.beforeCare && (
          <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted mb-1.5">
              Before your appointment
            </h3>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{service.beforeCare}</p>
          </div>
        )}

        <button
          onClick={() => { onBook(service.id); onClose(); }}
          className="btn-primary w-full justify-center py-3"
        >
          Book This Service
        </button>
      </div>
    </Modal>
  );
}

export default function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Check URL params for category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat && serviceCategories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [location.search]);

  // Open service from state
  useEffect(() => {
    if (location.state?.openService) {
      const svc = services.find((s) => s.id === location.state.openService);
      if (svc) setSelectedService(svc);
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    let result = services;
    if (activeCategory !== 'All') {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, search]);

  const handleBook = (serviceId) => {
    navigate(`/booking?service=${serviceId}`);
  };

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      {/* Header */}
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">OUR SERVICES</p>
          <h1 className="section-heading mb-1">Everything you need to feel your best.</h1>
          <p className="section-subheading">16 treatments across Hair, Skin, Spa, Nails and Makeup.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-muted dark:text-aura-dark-muted" />
            <input
              type="search"
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 pr-9"
              aria-label="Search services"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted dark:text-aura-dark-muted hover:text-aura-text"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <Tabs
          tabs={serviceCategories}
          active={activeCategory}
          onChange={setActiveCategory}
          className="mb-6"
        />

        {/* Results */}
        {loading ? (
          <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-2xl border border-aura-border dark:border-aura-dark-border overflow-hidden divide-y divide-aura-border dark:divide-aura-dark-border">
            {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} className="px-4" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="font-semibold text-aura-text dark:text-aura-dark-text mb-1">No services found</h3>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-4">Try another search term or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-2xl border border-aura-border dark:border-aura-dark-border overflow-hidden">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="service-row mx-3 cursor-pointer"
                onClick={() => setSelectedService(service)}
                role="button"
                aria-label={`View ${service.name} details`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedService(service)}
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{service.name}</p>
                    {service.popular && (
                      <span className="badge badge-amber text-[10px]">Popular</span>
                    )}
                  </div>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-0.5 line-clamp-1">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={11} className="text-aura-muted dark:text-aura-dark-muted" />
                    <span className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDuration(service.duration)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{formatPrice(service.price)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBook(service.id); }}
                    className="text-xs px-3 py-1 bg-aura-text dark:bg-aura-accent text-white rounded-lg hover:bg-aura-accent transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-aura-muted dark:text-aura-dark-muted text-center mt-4">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''} shown
        </p>
      </div>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={handleBook}
      />
    </main>
  );
}
