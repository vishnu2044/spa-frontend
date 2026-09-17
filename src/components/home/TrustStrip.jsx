// src/components/home/TrustStrip.jsx
import { Star, Scissors, Users, Clock } from 'lucide-react';

const stats = [
  { icon: Star, value: '4.9 ★', label: '500+ Client Reviews', color: 'text-amber-500' },
  { icon: Scissors, value: '16+', label: 'Beauty Services', color: 'text-aura-accent' },
  { icon: Users, value: '5', label: 'Specialists', color: 'text-aura-green-dark' },
  { icon: Clock, value: '6 Days', label: 'Open Weekly', color: 'text-blue-400' },
];

export default function TrustStrip() {
  return (
    <section
      className="bg-aura-surface dark:bg-aura-dark-surface border-y border-aura-border dark:border-aura-dark-border"
      aria-label="Trust indicators"
    >
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-0 md:divide-x divide-aura-border dark:divide-aura-dark-border">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 border-aura-border dark:border-aura-dark-border last:border-b-0 md:last:border-r-0"
            >
              <Icon size={20} className={color} aria-hidden="true" />
              <div>
                <p className="text-base font-semibold text-aura-text dark:text-aura-dark-text leading-none">
                  {value}
                </p>
                <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
