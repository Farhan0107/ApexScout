import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes from unauthenticated users
 */
export const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * Restricts access based on user role
 * @param {Array} allowedRoles 
 */
export const RoleBasedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
