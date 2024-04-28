import React, { useContext, createContext, useState } from 'react';

import { getToken } from '../services/api.auth.token';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../functions/toast'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || "");

    const navigate = useNavigate();
    const loginAction = async (data) => {
        try {
            const res = await getToken(data)
			
            if (res.data) {
                setToken(res.data);
                setUser(res.data.user)
                localStorage.setItem('token', res.data.access)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                navigate("/profile");
            }
        } catch (error) { 
			if (error.response) {
				if (error.response.status === 401) {
					notifyError("Incorrect username or password");
				} else if(error.message) {
					notifyError(error.message);
				}
			} else if (error.request) {
				console.log(error.request);
			} else {
				notifyError(error.message);
			}
		}
    };

    const logOut = () => {
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, user, setUser, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};