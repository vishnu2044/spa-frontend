// src/pages/Team.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Clock, Globe, ChevronRight, Calendar } from 'lucide-react';
import { fetchStaff } from '../api/endpoints';
import { getAvatarUrl } from '../utils/imageUtils';
import Modal from '../components/ui/Modal';
import StarRating from '../components/ui/StarRating';
import { SkeletonProfile } from '../components/ui/Skeleton';

function StaffModal({ member, onClose, onBook }) {
  if (!member) return null;
  return (
    <Modal isOpen={!!member} onClose={onClose} title={member.name} size="lg">
      <div className="p-5 space-y-5">
        <div className="flex items-start gap-4">
          <img
            src={getAvatarUrl(member.name, member.image || member.image_url)}
            alt={member.name}
            className="w-20 h-20 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-aura-text dark:text-aura-dark-text">{member.name}</h3>
            <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{member.role}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={Math.round(member.rating_cache || member.rating || 5)} size={14} />
              <span className="text-sm text-aura-muted dark:text-aura-dark-muted">
                {member.rating_cache || member.rating || 5} · {member.review_count_cache || member.reviews || 0} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-aura-text dark:text-aura-dark-text">{member.experience_years || member.experience || 0}+</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Years Experience</p>
          </div>
          <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-aura-text dark:text-aura-dark-text">{member.review_count_cache || member.reviews || 0}</p>
            <p className="text-xs text-aura-muted dark:text-aura-dark-muted">Client Reviews</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-aura-text dark:text-aura-dark-text mb-2">About</h4>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted leading-relaxed">{member.bio}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-aura-text dark:text-aura-dark-text mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {(member.specialties || []).map((s) => (
              <span key={s?.category || s} className="px-3 py-1 bg-aura-green dark:bg-aura-dark-surface2 text-aura-text dark:text-aura-dark-text text-xs rounded-full">
                {s?.category || s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted mb-1.5">Working Days</p>
            <p className="text-aura-text dark:text-aura-dark-text">{(member.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).join(', ')}</p>
          </div>
          <div className="bg-aura-surface2 dark:bg-aura-dark-surface2 rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-aura-muted dark:text-aura-dark-muted mb-1.5">Working Hours</p>
            <p className="text-aura-text dark:text-aura-dark-text">{member.working_hours || member.workingHours || "9:00 AM - 6:00 PM"}</p>
          </div>
        </div>

        <button
          onClick={() => { onBook(member); onClose(); }}
          className="btn-primary w-full justify-center py-3"
        >
          <Calendar size={16} /> Book with {member.name.split(' ')[0]}
        </button>
      </div>
    </Modal>
  );
}

export default function TeamPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchStaff();
        setStaff(data || []);
      } catch (err) {
        console.error('Failed to fetch staff', err);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  useEffect(() => {
    if (location.state?.openStaff && staff.length > 0) {
      const member = staff.find((s) => s.id === location.state.openStaff);
      if (member) setSelected(member);
    }
  }, [location.state, staff]);

  const handleBook = (member) => {
    navigate(`/booking?specialist=${member.id}`);
  };

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">OUR SPECIALISTS</p>
          <h1 className="section-heading">Meet the team.</h1>
          <p className="section-subheading">Expert care from trained and passionate beauty professionals.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="card p-5">
                <SkeletonProfile />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="card-hover p-5 cursor-pointer"
                onClick={() => setSelected(member)}
                role="button"
                aria-label={`View ${member.name}'s profile`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(member)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={getAvatarUrl(member.name, member.image || member.image_url)}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-aura-surface2 dark:bg-aura-dark-surface2"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-aura-text dark:text-aura-dark-text">{member.name}</h2>
                    <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{member.role}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <StarRating rating={Math.round(member.rating_cache || member.rating || 5)} size={12} />
                      <span className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.rating_cache || member.rating || 5}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-aura-muted dark:text-aura-dark-muted flex-shrink-0 mt-1" />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-aura-muted dark:text-aura-dark-muted mb-3">
                  <Clock size={12} />
                  {member.experience_years || member.experience || 0} years experience
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(member.specialties || []).slice(0, 3).map((s) => (
                    <span key={s?.category || s} className="px-2.5 py-0.5 bg-aura-surface2 dark:bg-aura-dark-surface2 text-aura-muted dark:text-aura-dark-muted text-xs rounded-full">
                      {s?.category || s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleBook(member); }}
                  className="btn-secondary text-xs w-full justify-center py-2"
                >
                  Book with {member.name.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StaffModal member={selected} onClose={() => setSelected(null)} onBook={handleBook} />
    </main>
  );
}
