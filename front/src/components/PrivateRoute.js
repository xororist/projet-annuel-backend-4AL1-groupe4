import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import  isAuthenticated from '../functions/TokenManager';


const PrivateRoute = () => {

    if (isAuthenticated()) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }

};

export default PrivateRoute;