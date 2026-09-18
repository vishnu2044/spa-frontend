// src/pages/Reviews.jsx
import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { fetchReviews, submitReview as submitReviewApi } from '../api/endpoints';
import { getAvatarUrl } from '../utils/imageUtils';
import StarRating from '../components/ui/StarRating';
import Tabs from '../components/ui/Tabs';

const FILTER_TABS = ['All', 'Hair', 'Spa', 'Skin', 'Makeup', 'Nails'];
const PAGE_SIZE = 4;

function ReviewCard({ review }) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-aura-green dark:bg-aura-dark-border overflow-hidden flex items-center justify-center text-sm font-semibold text-aura-accent flex-shrink-0">
            <img src={getAvatarUrl(review.name, review.avatar || review.image_url)} alt={review.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{review.name}</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{review.serviceLabel || review.service?.name || review.service}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <StarRating rating={review.rating} size={13} />
          {review.verified && (
            <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">✓ Verified</span>
          )}
          {review.source === 'user' && (
            <span className="text-[10px] text-aura-muted dark:text-aura-dark-muted">Demo review</span>
          )}
        </div>
      </div>
      <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed">"{review.text}"</p>
      <span className="badge badge-green mt-3">{review.serviceLabel || review.service?.name || review.service}</span>
    </div>
  );
}

function ReviewForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', service: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.service || !form.text.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    const newReview = {
      name: form.name,
      service: form.service,
      serviceLabel: form.service,
      rating: form.rating,
      text: form.text,
      source: 'user',
    };
    try {
      const addedReview = await onSubmit(newReview);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit review. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
          <ThumbsUp size={20} className="text-green-600" />
        </div>
        <p className="font-semibold text-aura-text dark:text-aura-dark-text">Thank you for your review!</p>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted mt-1">Your review has been successfully added.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Submit a review">
      <h3 className="font-semibold text-aura-text dark:text-aura-dark-text">Share Your Experience</h3>
      <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Submit a review to share your feedback.</p>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="review-name">
            Your Name *
          </label>
          <input
            id="review-name"
            type="text"
            value={form.name}
            onChange={handle('name')}
            placeholder="Your name"
            className="input-field"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="review-service">
            Service *
          </label>
          <select
            id="review-service"
            value={form.service}
            onChange={handle('service')}
            className="input-field"
          >
            <option value="">Select a service…</option>
            {['Hair', 'Skin', 'Spa', 'Nails', 'Makeup'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block">Rating</label>
        <StarRating
          rating={form.rating}
          size={24}
          interactive
          onChange={(r) => setForm((f) => ({ ...f, rating: r }))}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="review-text">
          Your Review *
        </label>
        <textarea
          id="review-text"
          value={form.text}
          onChange={handle('text')}
          placeholder="Tell us about your experience…"
          rows={4}
          className="input-field resize-none"
          maxLength={1000}
        />
      </div>

      <button type="submit" className="btn-primary w-full justify-center">
        Submit Review
      </button>
    </form>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState('All');
  const [allReviews, setAllReviews] = useState([]);
  const [showing, setShowing] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setAllReviews(data || []);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
        // Fallback or empty state could go here if API fails
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleNewReview = async (review) => {
    const data = await submitReviewApi(review);
    setAllReviews((prev) => [data, ...prev]);
    return data;
  };

  const filtered = filter === 'All'
    ? allReviews
    : allReviews.filter((r) => r.service === filter || r.serviceLabel?.includes(filter) || r.service?.name?.includes(filter));

  const avg = allReviews.length > 0 ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1) : "0.0";

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="label-tag mb-1">REVIEWS</p>
              <h1 className="section-heading">What our clients say.</h1>
            </div>
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-center sm:justify-end mb-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-3xl font-bold text-aura-text dark:text-aura-dark-text">{avg} / 5</p>
              <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{allReviews.length}+ Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2">
            <Tabs tabs={FILTER_TABS} active={filter} onChange={(t) => { setFilter(t); setShowing(PAGE_SIZE); }} className="mb-5" />

            {loading ? (
              <div className="text-center py-12">
                <p className="text-aura-muted dark:text-aura-dark-muted">Loading reviews...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">💬</p>
                <p className="text-aura-muted dark:text-aura-dark-muted">No reviews in this category yet.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {filtered.slice(0, showing).map((r) => (
                    <ReviewCard key={r.id || Math.random()} review={r} />
                  ))}
                </div>
                {showing < filtered.length && (
                  <button
                    onClick={() => setShowing((s) => s + PAGE_SIZE)}
                    className="btn-secondary w-full justify-center mt-4"
                  >
                    Load More Reviews
                  </button>
                )}
              </>
            )}
          </div>

          {/* Form */}
          <div className="card p-5 h-fit">
            <ReviewForm onSubmit={handleNewReview} />
          </div>
        </div>
      </div>
    </main>
  );
}
