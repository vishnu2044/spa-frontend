// src/pages/admin/AdminOffers.jsx
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { offers as defaultOffers } from '../../data/offers';

const EMPTY = { title: '', discount: '', category: 'All', code: '', description: '', status: 'active' };

function OfferForm({ value, onChange, onSave, onCancel }) {
  return (
    <div className="space-y-3">
      {[
        { id: 'of-name', field: 'title', label: 'Offer Name *', type: 'text' },
        { id: 'of-disc', field: 'discount', label: 'Discount Label *', type: 'text', placeholder: 'e.g. 20% OFF' },
        { id: 'of-code', field: 'code', label: 'Promo Code', type: 'text' },
        { id: 'of-desc', field: 'description', label: 'Description', type: 'text' },
      ].map(({ id, field, label, type, placeholder }) => (
        <div key={field}>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor={id}>{label}</label>
          <input id={id} type={type} value={value[field] || ''} placeholder={placeholder} onChange={(e) => onChange({ ...value, [field]: e.target.value })} className="input-field" />
        </div>
      ))}
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block">Applicable Category</label>
        <select value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} className="input-field">
          {['All', 'Hair', 'Skin', 'Spa', 'Nails', 'Makeup'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block">Status</label>
        <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value })} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="btn-primary flex-1 justify-center"><Check size={14} /> Save</button>
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center"><X size={14} /> Cancel</button>
      </div>
    </div>
  );
}

export default function AdminOffers() {
  const [offers, setOffers] = useState(defaultOffers.map((o) => ({ ...o, status: 'active' })));
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newOffer, setNewOffer] = useState(EMPTY);

  const handleAdd = () => {
    setOffers((prev) => [...prev, { ...newOffer, id: `offer-${Date.now()}`, color: 'green' }]);
    setNewOffer(EMPTY);
    setAdding(false);
  };

  const handleEdit = () => {
    setOffers((prev) => prev.map((o) => o.id === editing.id ? editing : o));
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this offer?')) setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const toggleStatus = (id) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: o.status === 'active' ? 'inactive' : 'active' } : o));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Offers</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{offers.length} offers</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-xs">
          <Plus size={14} /> New Offer
        </button>
      </div>

      {adding && (
        <div className="card p-5 animate-slide-up">
          <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-4">New Offer</h2>
          <OfferForm value={newOffer} onChange={setNewOffer} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-3">
        {offers.map((offer) => (
          editing?.id === offer.id ? (
            <div key={offer.id} className="card p-5 animate-slide-up">
              <OfferForm value={editing} onChange={setEditing} onSave={handleEdit} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div key={offer.id} className={`card p-4 flex items-center gap-4 ${offer.status === 'inactive' ? 'opacity-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-aura-text dark:text-aura-dark-text">{offer.title}</p>
                  <span className={`badge ${offer.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {offer.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 text-xs text-aura-muted dark:text-aura-dark-muted">
                  <span className="font-bold text-aura-accent">{offer.discount}</span>
                  <span>Category: {offer.category}</span>
                  {offer.code && <span className="font-mono">Code: {offer.code}</span>}
                </div>
                {offer.description && <p className="text-xs text-aura-muted dark:text-aura-dark-muted mt-1 line-clamp-1">{offer.description}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => toggleStatus(offer.id)} className="text-xs px-2 py-1 border border-aura-border dark:border-aura-dark-border rounded-lg text-aura-muted dark:text-aura-dark-muted hover:text-aura-text dark:hover:text-aura-dark-text transition-colors">
                  {offer.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => setEditing(offer)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(offer.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
