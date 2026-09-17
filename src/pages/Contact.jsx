// src/pages/Contact.jsx
import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSubmitted(true);
  };

  const handle = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
  };

  return (
    <main className="pt-16 pb-24 md:pb-10 min-h-screen bg-aura-bg dark:bg-aura-dark-bg">
      <div className="bg-aura-surface dark:bg-aura-dark-surface border-b border-aura-border dark:border-aura-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="label-tag mb-1">CONTACT</p>
          <h1 className="section-heading">Visit Aura Wellness.</h1>
          <p className="section-subheading">We're here to help — come visit, call, or drop us a message.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            {/* Location */}
            <div className="card p-5">
              <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-4">Visit Aura</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-aura-green dark:bg-aura-dark-surface2 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="text-aura-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">Address</p>
                    <p className="text-sm text-aura-muted dark:text-aura-dark-muted">Aura Wellness, Beach Road<br />Calicut (Kozhikode), Kerala 673001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-aura-green dark:bg-aura-dark-surface2 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={14} className="text-aura-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text">Opening Hours</p>
                    <p className="text-sm text-aura-muted dark:text-aura-dark-muted">Mon – Sat: 9:00 AM – 8:00 PM</p>
                    <p className="text-sm text-aura-muted dark:text-aura-dark-muted">Sunday: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get in touch */}
            <div className="card p-5">
              <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-4">Get in Touch</h2>
              <div className="space-y-3">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: Mail, label: 'Email', value: 'hello@aurawellness.in', href: 'mailto:hello@aurawellness.in' },
                  {
                    icon: MessageCircle,
                    label: 'WhatsApp',
                    value: 'Chat with us',
                    href: 'https://wa.me/919876543210?text=Hi%20Aura%20Wellness',
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-aura-surface2 dark:hover:bg-aura-dark-surface2 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-aura-green dark:bg-aura-dark-surface2 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-aura-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-aura-muted dark:text-aura-dark-muted">{label}</p>
                      <p className="text-sm font-medium text-aura-text dark:text-aura-dark-text group-hover:text-aura-accent transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-44 bg-aura-surface2 dark:bg-aura-dark-surface2 flex items-center justify-center border border-aura-border dark:border-aura-dark-border">
              <a
                href="https://maps.google.com/?q=Kozhikode,Kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-aura-muted dark:text-aura-dark-muted hover:text-aura-accent transition-colors"
              >
                <MapPin size={28} />
                <span className="text-sm font-medium">View on Google Maps</span>
                <span className="text-xs">Calicut, Kerala</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="card p-5">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Check size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-aura-text dark:text-aura-dark-text mb-1">Message sent!</h3>
                <p className="text-sm text-aura-muted dark:text-aura-dark-muted">
                  Thanks for reaching out. We'll get back to you shortly.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name:'',phone:'',email:'',subject:'',message:'' }); }} className="btn-secondary mt-5">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Contact form">
                <h2 className="font-semibold text-aura-text dark:text-aura-dark-text mb-1">Send us a message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'c-name', field: 'name', label: 'Name *', placeholder: 'Your name', type: 'text' },
                    { id: 'c-phone', field: 'phone', label: 'Phone *', placeholder: 'Phone number', type: 'tel' },
                    { id: 'c-email', field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                    { id: 'c-subject', field: 'subject', label: 'Subject', placeholder: 'What is this about?', type: 'text' },
                  ].map(({ id, field, label, placeholder, type }) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor={id}>
                        {label}
                      </label>
                      <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={handle(field)}
                        className="input-field"
                      />
                      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1 block" htmlFor="c-message">
                    Message *
                  </label>
                  <textarea
                    id="c-message"
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={handle('message')}
                    rows={4}
                    className="input-field resize-none"
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
