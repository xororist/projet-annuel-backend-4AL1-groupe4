import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const PrivateRoute = () => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');

    return user || token ? <Outlet /> : <Navigate to="/not-found" replace />;
};

export default PrivateRoute;
