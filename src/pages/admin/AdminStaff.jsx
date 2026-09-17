// src/pages/admin/AdminStaff.jsx
import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';
import { staff as defaultStaff } from '../../data/staff';
import StarRating from '../../components/ui/StarRating';

const EMPTY = { name: '', role: '', experience: 0, specialties: [], workingDays: ['Monday', 'Wednesday', 'Friday'], workingHours: '9:00 AM – 6:00 PM', bio: '', categories: ['Hair'], image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' };

function StaffForm({ value, onChange, onSave, onCancel }) {
  const specStr = Array.isArray(value.specialties) ? value.specialties.join(', ') : value.specialties;
  return (
    <div className="space-y-3">
      {[
        { id: 'st-name', field: 'name', label: 'Full Name *', type: 'text' },
        { id: 'st-role', field: 'role', label: 'Role *', type: 'text' },
        { id: 'st-exp', field: 'experience', label: 'Years Experience', type: 'number' },
      ].map(({ id, field, label, type }) => (
        <div key={field}>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor={id}>{label}</label>
          <input id={id} type={type} value={value[field] || ''} onChange={(e) => onChange({ ...value, [field]: type === 'number' ? Number(e.target.value) : e.target.value })} className="input-field" />
        </div>
      ))}
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block">Specialties (comma-separated)</label>
        <input type="text" value={specStr} onChange={(e) => onChange({ ...value, specialties: e.target.value.split(',').map((s) => s.trim()) })} className="input-field" />
      </div>
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block">Working Hours</label>
        <input type="text" value={value.workingHours || ''} onChange={(e) => onChange({ ...value, workingHours: e.target.value })} className="input-field" />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="btn-primary flex-1 justify-center"><Check size={14} /> Save</button>
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center"><X size={14} /> Cancel</button>
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const [staff, setStaff] = useState(defaultStaff);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newStaff, setNewStaff] = useState(EMPTY);
  const [availability, setAvailability] = useState({});

  const toggleAvail = (id) => setAvailability((a) => ({ ...a, [id]: a[id] === false ? true : false }));
  const isAvail = (id) => availability[id] !== false;

  const handleAdd = () => {
    const id = newStaff.name.toLowerCase().replace(/\s+/g, '-');
    setStaff((prev) => [...prev, { ...newStaff, id, rating: 4.8, reviews: 0 }]);
    setNewStaff(EMPTY);
    setAdding(false);
  };

  const handleEdit = () => {
    setStaff((prev) => prev.map((s) => s.id === editing.id ? editing : s));
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this staff member?')) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Staff</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{staff.length} specialists</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-xs">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {adding && (
        <div className="card p-5 animate-slide-up">
          <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-4">New Staff Member</h2>
          <StaffForm value={newStaff} onChange={setNewStaff} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member) => (
          editing?.id === member.id ? (
            <div key={member.id} className="card p-5 md:col-span-2 animate-slide-up">
              <StaffForm value={editing} onChange={setEditing} onSave={handleEdit} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div key={member.id} className="card p-4">
              <div className="flex items-start gap-3">
                <img src={member.image} alt={member.name} className={`w-12 h-12 rounded-xl object-cover flex-shrink-0 transition-opacity ${isAvail(member.id) ? 'opacity-100' : 'opacity-40'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{member.name}</p>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StarRating rating={Math.round(member.rating)} size={11} />
                    <span className="text-xs text-aura-muted dark:text-aura-dark-muted">{member.rating}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => toggleAvail(member.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted" title="Toggle availability">
                    {isAvail(member.id) ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => setEditing(member)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {member.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-aura-surface2 dark:bg-aura-dark-surface2 text-xs text-aura-muted dark:text-aura-dark-muted rounded-full">{s}</span>
                ))}
              </div>
              {!isAvail(member.id) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Currently unavailable</p>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
