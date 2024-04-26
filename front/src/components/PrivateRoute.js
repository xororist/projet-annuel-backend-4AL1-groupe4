import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const PrivateRoute = () => {
    const { user } = useContext(UserContext);
    return  user ? <Outlet /> : <Navigate to="/not-found" replace />;
};

export default PrivateRoute;
