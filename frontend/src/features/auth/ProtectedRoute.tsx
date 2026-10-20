import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '@/components/ui/Spinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Verificando sessão" />;
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
