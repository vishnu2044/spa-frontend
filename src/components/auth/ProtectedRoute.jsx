import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ adminOnly = false, staffAllowed = false }) {
  const { user, isAuthenticated, loading, isAdmin, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-aura-bg dark:bg-aura-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-aura-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />;
  }

  if (adminOnly && !isAdmin) {
    // If they are logged in but not an admin, redirect them to home
    return <Navigate to="/" replace />;
  }

  if (staffAllowed && !isStaff) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
