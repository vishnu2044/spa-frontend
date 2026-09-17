// src/components/home/QuickBookBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { services, serviceCategories } from '../../data/services';

const categories = serviceCategories.filter((c) => c !== 'All');

export default function QuickBookBar() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(null);

  const handleBook = (serviceId) => {
    navigate(`/booking?service=${serviceId}`);
  };

  const filteredServices = selectedCat
    ? services.filter((s) => s.category === selectedCat).slice(0, 6)
    : services.filter((s) => s.popular).slice(0, 6);

  return (
    <section className="py-12 bg-aura-surface2 dark:bg-aura-dark-surface2" aria-label="Quick booking">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Title & categories */}
          <div>
            <p className="label-tag mb-2">Quick Book</p>
            <h2 className="section-heading mb-3">What are you looking for?</h2>
            <p className="section-subheading mb-6">
              Select a category and instantly book your treatment.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat === selectedCat ? null : cat)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedCat === cat
                      ? 'border-aura-accent bg-aura-accent/5 text-aura-accent dark:border-aura-accent-light dark:text-aura-accent-light'
                      : 'border-aura-border dark:border-aura-dark-border bg-aura-surface dark:bg-aura-dark-surface text-aura-text dark:text-aura-dark-text hover:border-aura-accent/50'
                  }`}
                  aria-pressed={selectedCat === cat}
                >
                  {cat}
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Service list */}
          <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-2xl border border-aura-border dark:border-aura-dark-border divide-y divide-aura-border dark:divide-aura-dark-border overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted">
                {selectedCat ? `${selectedCat} Services` : 'Popular Services'}
              </p>
              <button
                onClick={() => navigate('/services')}
                className="text-xs text-aura-accent hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 transition-colors group"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text truncate">
                    {service.name}
                  </p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">
                    {service.duration} min
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">
                    ₹{service.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleBook(service.id)}
                    className="text-xs text-aura-accent hover:underline mt-0.5 hidden group-hover:block"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
