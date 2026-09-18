// src/pages/admin/AdminServices.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';
import { fetchServices, createAdminService, updateAdminService, deleteAdminService, toggleAdminServiceStatus } from '../../api/endpoints';
import { formatPrice, formatDuration } from '../../utils/helpers';
import { getServiceImageUrl } from '../../utils/imageUtils';
import Modal from '../../components/ui/Modal';

const EMPTY = { name: '', category: 'Hair', duration: 60, price: 500, description: '' };

function ServiceForm({ value, onChange, onSave, onCancel }) {
  return (
    <div className="space-y-3">
      {[
        { id: 'svc-name', field: 'name', label: 'Service Name *', type: 'text', placeholder: 'e.g. Signature Haircut' },
        { id: 'svc-price', field: 'price', label: 'Price (₹) *', type: 'number', placeholder: '500' },
        { id: 'svc-duration', field: 'duration', label: 'Duration (min) *', type: 'number', placeholder: '60' },
      ].map(({ id, field, label, type, placeholder }) => (
        <div key={field}>
          <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor={id}>{label}</label>
          <input
            id={id}
            type={type}
            value={value[field] || ''}
            onChange={(e) => onChange({ ...value, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
            placeholder={placeholder}
            className="input-field"
          />
        </div>
      ))}
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="svc-cat">Category</label>
        <select id="svc-cat" value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} className="input-field">
          {['Hair', 'Skin', 'Spa', 'Nails', 'Makeup'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="svc-desc">Description</label>
        <textarea id="svc-desc" rows={3} value={value.description || ''} onChange={(e) => onChange({ ...value, description: e.target.value })} className="input-field resize-none" placeholder="Describe the service..." />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="btn-primary flex-1 justify-center"><Check size={14} /> Save</button>
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center"><X size={14} /> Cancel</button>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState(EMPTY);
  const [activeStates, setActiveStates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchServices();
        setServices(data || []);
        const initialActive = {};
        (data || []).forEach(s => {
          initialActive[s.id] = s.status !== 'inactive';
        });
        setActiveStates(initialActive);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleActive = async (id) => {
    const currentActive = activeStates[id] !== false;
    const newStatus = currentActive ? 'inactive' : 'active';
    try {
      await toggleAdminServiceStatus(id, newStatus);
      setActiveStates((prev) => ({ ...prev, [id]: !currentActive }));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const isActive = (id) => activeStates[id] !== false;

  const handleAdd = async () => {
    try {
      // Backend expects category_id in reality, but assuming API handles category object/string correctly based on the updated api_validations/backendNeeds logic.
      const added = await createAdminService(newService);
      setServices((prev) => [...prev, added]);
      setActiveStates((prev) => ({ ...prev, [added.id]: added.status !== 'inactive' }));
      setNewService(EMPTY);
      setAdding(false);
    } catch (err) {
      console.error('Failed to add service', err);
    }
  };

  const handleEdit = async (service) => {
    try {
      const updated = await updateAdminService(service.id, service);
      setServices((prev) => prev.map((s) => s.id === service.id ? updated : s));
      setEditing(null);
    } catch (err) {
      console.error('Failed to edit service', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await deleteAdminService(id);
        setServices((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error('Failed to delete service', err);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text">Services</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">{loading ? 'Loading...' : `${services.length} services`}</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-xs">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card p-5 animate-slide-up">
          <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-4">New Service</h2>
          <ServiceForm value={newService} onChange={setNewService} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-2">
        {services.map((svc) => (
          <div key={svc.id}>
            {editing?.id === svc.id ? (
              <div className="card p-5 animate-slide-up">
                <ServiceForm value={editing} onChange={setEditing} onSave={() => handleEdit(editing)} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div className="card p-4 flex items-center gap-3">
                <img src={getServiceImageUrl(svc.name, svc.image || svc.image_url)} alt={svc.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${isActive(svc.id) ? 'text-aura-text dark:text-aura-dark-text' : 'text-aura-border dark:text-aura-dark-border line-through'}`}>
                      {svc.name}
                    </p>
                    <span className="badge badge-green text-[10px]">{svc.category?.name || svc.category}</span>
                  </div>
                  <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{formatDuration(svc.duration_minutes || svc.duration)} · {formatPrice(svc.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(svc.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent" title="Toggle active">
                    {isActive(svc.id) ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => setEditing(svc)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(svc.id)} className="p-1.5 text-aura-muted dark:text-aura-dark-muted hover:text-red-500" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
