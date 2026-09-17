// src/components/ui/Tabs.jsx
export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto no-scrollbar ${className}`}
      role="tablist"
      aria-label="Category tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={active === tab ? 'tab-btn-active' : 'tab-btn-inactive'}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
