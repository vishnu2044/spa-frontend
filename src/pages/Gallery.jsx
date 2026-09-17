// src/pages/Gallery.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gallery, beforeAfterSlides, galleryCategories } from '../data/gallery';
import Tabs from '../components/ui/Tabs';
import { SkeletonCard } from '../components/ui/Skeleton';

// Lightbox
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)), [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  const img = images[current];

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-label="Image lightbox"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>

      <button
        onClick={prev}
        className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="max-w-4xl w-full mx-16 text-center">
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-[80vh] w-auto mx-auto rounded-xl object-contain animate-scale-in"
        />
        {img.caption && (
          <p className="text-white/70 text-sm mt-3">{img.caption}</p>
        )}
        <p className="text-white/40 text-xs mt-1">{current + 1} / {images.length}</p>
      </div>

      <button
        onClick={next}
        className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

// Before/After Slider
function BeforeAfterSlider({ slide }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => { dragging.current = true; };
  const handleMouseMove = (e) => { if (dragging.current) updatePosition(e.clientX); };
  const handleMouseUp = () => { dragging.current = false; };

  const handleTouchMove = (e) => {
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      role="slider"
      aria-label={`Before/after slider for ${slide.label}`}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
    >
      {/* After (full) */}
      <img src={slide.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img src={slide.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / position}%`, maxWidth: 'none' }} />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize"
          onMouseDown={handleMouseDown}
          onTouchStart={() => { dragging.current = true; }}
        >
          <div className="flex gap-1">
            <ChevronLeft size={10} className="text-aura-text" />
            <ChevronRight size={10} className="text-aura-text" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">Before</div>
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">After</div>
    </div>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [baCategory, setBaCategory] = useState('Hair');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredGallery = activeCategory === 'All' || activeCategory === 'Salon'
    ? gallery
    : gallery.filter((g) => g.category === activeCategory);

  const filteredBA = beforeAfterSlides.filter((s) => s.category === baCategory);

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">GALLERY</p>
          <h1 className="section-heading">Beauty in every detail.</h1>
          <p className="section-subheading">A glimpse into our work and our space.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Category tabs */}
        <Tabs
          tabs={galleryCategories}
          active={activeCategory}
          onChange={setActiveCategory}
          className="mb-6"
        />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredGallery.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className="group rounded-2xl overflow-hidden relative aspect-square bg-aura-surface2 dark:bg-aura-dark-surface2 cursor-zoom-in"
                aria-label={`Open ${item.alt} in lightbox`}
              >
                <img
                  src={item.thumb}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-end">
                  <p className="text-white text-xs px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Before/After */}
        <section className="mt-14" aria-label="Before and after transformations">
          <div className="mb-5">
            <p className="label-tag mb-1">TRANSFORMATIONS</p>
            <h2 className="section-heading">Before & After.</h2>
            <p className="section-subheading">Drag the slider to see the transformation.</p>
          </div>

          <div className="flex gap-2 mb-5">
            {['Hair', 'Makeup', 'Nails'].map((cat) => (
              <button
                key={cat}
                onClick={() => setBaCategory(cat)}
                className={baCategory === cat ? 'tab-btn-active' : 'tab-btn-inactive'}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBA.map((slide) => (
              <div key={slide.id}>
                <BeforeAfterSlider slide={slide} />
                <p className="text-sm text-center text-aura-muted dark:text-aura-dark-muted mt-2">{slide.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filteredGallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
