// src/components/ui/Skeleton.jsx
export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 rounded ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      <div className="skeleton h-40 w-full rounded-lg" />
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-1/2" />
      <SkeletonLine className="w-full" />
    </div>
  );
}

export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 py-4 border-b border-aura-border dark:border-aura-dark-border ${className}`}>
      <div className="skeleton h-16 w-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-2/3" />
        <SkeletonLine className="w-1/3" />
      </div>
      <div className="skeleton h-8 w-16 rounded-lg" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-4">
      <div className="skeleton h-16 w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-1/2" />
        <SkeletonLine className="w-1/3" />
      </div>
    </div>
  );
}
