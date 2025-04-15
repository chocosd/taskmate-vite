import { useAuth } from '@hooks/useAuth.hooks';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" />;
}
