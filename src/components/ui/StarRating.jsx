// src/components/ui/StarRating.jsx
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, max = 5, size = 14, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'group' : undefined} aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onChange?.(i + 1)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          aria-label={interactive ? `${i + 1} star` : undefined}
          tabIndex={interactive ? 0 : -1}
        >
          <Star
            size={size}
            className={i < rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-aura-border dark:text-aura-dark-border'}
          />
        </button>
      ))}
    </div>
  );
}
