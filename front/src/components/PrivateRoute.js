import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import  isAuthenticated from '../functions/TokenManager';

const PrivateRoute = () => {

    if (isAuthenticated()) {
        return <Outlet />;
    } else {
        return <Navigate to="/not-found" replace />;
    }

};

export default PrivateRoute;