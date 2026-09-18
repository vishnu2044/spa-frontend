// src/pages/Home.jsx
import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroIntro from '../components/home/HeroIntro';
import TrustStrip from '../components/home/TrustStrip';
import QuickBookBar from '../components/home/QuickBookBar';
import { useState, useEffect } from 'react';
import { fetchServices, fetchStaff, fetchReviews } from '../api/endpoints';
import { getAvatarUrl, getServiceImageUrl } from '../utils/imageUtils';
import { formatPrice, formatDuration } from '../utils/helpers';
import StarRating from '../components/ui/StarRating';
import { SkeletonRow } from '../components/ui/Skeleton';

export default function Home() {
  const navigate = useNavigate();
  const [popularServices, setPopularServices] = useState([]);
  const [featuredStaff, setFeaturedStaff] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [servicesData, staffData, reviewsData] = await Promise.all([
          fetchServices(),
          fetchStaff(),
          fetchReviews()
        ]);
        
        setPopularServices((servicesData || []).filter(s => s.is_popular || s.popular).slice(0, 4));
        setFeaturedStaff((staffData || []).slice(0, 3));
        setFeaturedReviews((reviewsData || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <main>
      {/* Hero */}
      <HeroIntro />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Quick Book */}
      <QuickBookBar />

      {/* Popular Services */}
      <section className="py-14 bg-aura-bg dark:bg-aura-dark-bg" aria-label="Popular services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-tag mb-1">Our Services</p>
              <h2 className="section-heading">Everything you need<br />to feel your best.</h2>
            </div>
            <Link to="/services" className="btn-ghost hidden sm:flex">
              All Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-aura-surface dark:bg-aura-dark-surface rounded-2xl border border-aura-border dark:border-aura-dark-border overflow-hidden">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="service-row cursor-pointer mx-3"
                onClick={() => navigate('/services', { state: { openService: service.id } })}
                role="button"
                aria-label={`${service.name} – ${formatPrice(service.price)}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/services', { state: { openService: service.id } })}
              >
                <img
                  src={getServiceImageUrl(service.name, service.image || service.image_url)}
                  alt={service.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{service.name}</p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-0.5">{formatDuration(service.duration_minutes || service.duration)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{formatPrice(service.price)}</p>
                  <Link
                    to={`/booking?service=${service.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-aura-accent hover:underline mt-0.5"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/services" className="btn-secondary">
              Browse All 16 Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Aura */}
      <section className="py-14 bg-aura-green/30 dark:bg-aura-dark-surface2" aria-label="Why choose Aura">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌿', title: 'Natural Products', desc: 'We use premium botanical and certified cruelty-free products.' },
              { icon: '⭐', title: 'Expert Specialists', desc: 'Our team has 4–8 years of professional training and experience.' },
              { icon: '📅', title: 'Easy Booking', desc: 'Book online in minutes. Cancel or reschedule hassle-free.' },
              { icon: '✨', title: 'Personalised Care', desc: 'Every treatment is tailored to your unique needs.' },
            ].map((item) => (
              <div key={item.title} className="card p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-sm text-aura-text dark:text-aura-dark-text mb-1">{item.title}</h3>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-14 bg-aura-bg dark:bg-aura-dark-bg" aria-label="Meet the team">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-tag mb-1">Our Specialists</p>
              <h2 className="section-heading">Meet the team.</h2>
            </div>
            <Link to="/team" className="btn-ghost hidden sm:flex">
              All Team <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredStaff.map((member) => (
              <Link
                key={member.id}
                to={`/team`}
                state={{ openStaff: member.id }}
                className="card-hover p-4 flex gap-4 items-start"
              >
                <img
                  src={getAvatarUrl(member.name, member.image || member.image_url)}
                  alt={member.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-aura-surface2"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{member.name}</p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.role}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <StarRating rating={Math.round(member.rating_cache || member.rating || 5)} size={12} />
                    <span className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.rating_cache || member.rating || 5}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="py-14 bg-aura-surface2 dark:bg-aura-dark-surface2" aria-label="Customer reviews">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-tag mb-1">Reviews</p>
              <h2 className="section-heading">What our clients say.</h2>
            </div>
            <Link to="/reviews" className="btn-ghost hidden sm:flex">
              All Reviews <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredReviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-aura-green dark:bg-aura-dark-border flex items-center justify-center text-sm font-medium text-aura-accent overflow-hidden">
                    <img src={getAvatarUrl(review.name, review.avatar || review.image_url)} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{review.name}</p>
                    <StarRating rating={review.rating} size={11} />
                  </div>
                </div>
                <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed line-clamp-3">
                  "{review.text}"
                </p>
                <span className="badge badge-green mt-3">{review.serviceLabel || review.service?.name || review.service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-aura-text dark:bg-aura-dark-surface" aria-label="Book call to action">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-aura-accent font-medium text-sm tracking-widest uppercase mb-3">AURA WELLNESS</p>
          <h2 className="font-serif text-display-md text-white mb-4">
            Ready for your self-care ritual?
          </h2>
          <p className="text-white/70 mb-8 text-sm">
            Book your appointment in minutes. Choose your service, specialist, date and time — it's that simple.
          </p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-aura-accent text-white rounded-xl font-medium hover:bg-aura-accent-light transition-colors">
            Book Your Appointment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
