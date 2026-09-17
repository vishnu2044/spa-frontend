// src/components/home/HeroIntro.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroIntro() {
  return (
    <section
      className="pt-24 md:pt-20 pb-0"
      aria-label="Introduction"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
          {/* Text */}
          <div className="py-8 lg:py-12 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-5">
              <span className="label-tag">Calicut, Kerala</span>
              <span className="h-px flex-1 max-w-[2rem] bg-aura-border dark:bg-aura-dark-border" />
              <span className="flex items-center gap-1 text-xs text-aura-muted dark:text-aura-dark-muted">
                <Sparkles size={12} className="text-aura-accent" />
                Open Today · 9 AM – 8 PM
              </span>
            </div>

            <h1 className="font-serif text-display-lg text-aura-text dark:text-aura-dark-text mb-6 text-balance leading-tight">
              A little time
              <br />
              <em className="not-italic text-aura-accent">for yourself.</em>
            </h1>

            <p className="text-base text-aura-muted dark:text-aura-dark-muted mb-2 max-w-md leading-relaxed">
              Aura Wellness is Calicut's premium salon & spa — offering expert hair, skin, body and beauty treatments in a calm, welcoming environment.
            </p>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-8 max-w-md">
              Beauty, wellness and time for yourself.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/booking"
                id="hero-book-btn"
                className="btn-primary gap-2"
              >
                Book Appointment
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/services"
                className="btn-secondary gap-2"
              >
                Explore Services
              </Link>
            </div>

            {/* Quick trust */}
            <div className="mt-8 pt-6 border-t border-aura-border dark:border-aura-dark-border flex items-center gap-6">
              <div>
                <p className="text-lg font-semibold text-aura-text dark:text-aura-dark-text">4.9 ★</p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">500+ Reviews</p>
              </div>
              <div className="h-8 w-px bg-aura-border dark:bg-aura-dark-border" />
              <div>
                <p className="text-lg font-semibold text-aura-text dark:text-aura-dark-text">16+</p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Services</p>
              </div>
              <div className="h-8 w-px bg-aura-border dark:bg-aura-dark-border" />
              <div>
                <p className="text-lg font-semibold text-aura-text dark:text-aura-dark-text">5</p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Specialists</p>
              </div>
            </div>
          </div>

          {/* Image collage */}
          <div className="order-1 lg:order-2 relative">
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:max-w-none">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-aura-surface2 dark:bg-aura-dark-surface2">
                  <img
                    src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&q=80"
                    alt="Hair styling at Aura Wellness"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-aura-green dark:bg-aura-dark-surface2 p-5 flex flex-col justify-between">
                  <p className="font-serif text-3xl text-aura-text dark:text-aura-dark-text">500+</p>
                  <p className="text-sm text-aura-muted dark:text-aura-dark-muted">Happy clients</p>
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-aura-surface2 dark:bg-aura-dark-surface2">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80"
                    alt="Facial treatment at Aura Wellness"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-aura-surface2 dark:bg-aura-dark-surface2">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80"
                    alt="Spa massage at Aura Wellness"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-4 left-0 lg:-left-4 bg-aura-surface dark:bg-aura-dark-surface rounded-xl shadow-card px-3 py-2 flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-aura-text dark:text-aura-dark-text">Open Now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
