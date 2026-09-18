import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aura-bg dark:bg-aura-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-aura-accent/10 mb-4">
            <Lock className="text-aura-accent" size={24} />
          </div>
          <h1 className="font-serif text-3xl text-aura-text dark:text-aura-dark-text mb-2">Admin Portal</h1>
          <p className="text-sm text-aura-muted dark:text-aura-dark-muted">
            Sign in to manage Aura Wellness
          </p>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mb-4 border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1.5 block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-aura-muted dark:text-aura-dark-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="admin@aurawellness.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-aura-muted dark:text-aura-dark-muted mb-1.5 block" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-aura-muted dark:text-aura-dark-muted" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="••••••••"
                  minLength={8}
                  maxLength={12}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-6 py-3 text-sm flex items-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-aura-muted dark:text-aura-dark-muted mt-8">
          &copy; {new Date().getFullYear()} Aura Wellness. All rights reserved.
        </p>
      </div>
    </div>
  );
}
