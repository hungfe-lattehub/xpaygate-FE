import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface PrivateRouteProps {
    children: JSX.Element;
    permission?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permission }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (permission && !user.authorities.includes(permission) && !user.authorities.includes('ADMIN')) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
