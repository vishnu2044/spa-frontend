import { useState, useEffect } from 'react';
import { Check, EyeOff, Trash2 } from 'lucide-react';
import { fetchAdminReviews, toggleAdminReviewVisibility, deleteAdminReview } from '../../api/endpoints';
import { getAvatarUrl } from '../../utils/imageUtils';
import StarRating from '../../components/ui/StarRating';
import { formatDate } from '../../utils/helpers';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [hidden, setHidden] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchAdminReviews();
        setReviews(data || []);
        
        const hiddenSet = new Set();
        (data || []).forEach(r => {
          if (r.status === 'hidden' || r.visibility === 'hidden') hiddenSet.add(r.id);
        });
        setHidden(hiddenSet);
      } catch (err) {
        console.error('Failed to load admin reviews', err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleHide = async (id) => {
    const isHidden = hidden.has(id);
    const newStatus = isHidden ? 'published' : 'hidden';
    try {
      await toggleAdminReviewVisibility(id, newStatus);
      setHidden((h) => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; });
    } catch (err) {
      console.error('Failed to toggle review visibility', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteAdminReview(id);
        setReviews((r) => r.filter((rv) => rv.id !== id));
      } catch (err) {
        console.error('Failed to delete review', err);
      }
    }
  };

  const visible = reviews.filter((r) => !hidden.has(r.id));
  const hiddenCount = hidden.size;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Reviews</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">
            {reviews.length} total · {hiddenCount} hidden
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => {
          const isHidden = hidden.has(review.id);
          return (
            <div key={review.id} className={`card p-4 transition-opacity ${isHidden ? 'opacity-40' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-aura-green dark:bg-aura-dark-border flex items-center justify-center text-sm font-semibold text-aura-accent overflow-hidden">
                    <img src={getAvatarUrl(review.name, review.avatar || review.image_url)} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">{review.name}</p>
                    <StarRating rating={review.rating} size={11} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {review.source === 'user' && <span className="badge badge-amber text-[10px]">Demo</span>}
                  {review.verified && <span className="badge badge-green text-[10px]">Verified</span>}
                  <button onClick={() => handleHide(review.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-amber-500" title={isHidden ? 'Show' : 'Hide'}>
                    <EyeOff size={14} />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-red-500" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-2">"{review.text}"</p>
              <div className="flex items-center gap-3 text-xs text-aura-muted dark:text-aura-dark-muted">
                <span className="badge badge-green">{review.serviceLabel || review.service}</span>
                <span>{formatDate(review.date)}</span>
                {isHidden && <span className="text-amber-600 dark:text-amber-400">Hidden from public</span>}
              </div>
            </div>
          );
        })}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 text-aura-muted dark:text-aura-dark-muted">
          <p className="text-3xl mb-2">💬</p>
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
