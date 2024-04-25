import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => (
    isAuthenticated ? <Outlet /> : <Navigate to="/not-found" replace />
);

export default PrivateRoute;
