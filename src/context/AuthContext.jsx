import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchCurrentUser } from '../api/endpoints';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('aura_token');
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('aura_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    // For FastAPI OAuth2 password flow, we need username and password
    const data = await loginUser({ username: email, password });
    if (data.access_token) {
      localStorage.setItem('aura_token', data.access_token);
      // Fetch user profile to get roles
      const userData = await fetchCurrentUser();
      setUser(userData);
      return userData;
    }
    throw new Error('Invalid login response');
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.is_superuser,
    isStaff: user?.role === 'staff' || user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
