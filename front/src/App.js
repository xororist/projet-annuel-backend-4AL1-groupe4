import './App.css';
import React from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthProvider from './contexts/AuthContext';

function App() {
    
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Navigate to='/home' />} />
                    <Route path="/home" element={<Home />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </AuthProvider> 
        </Router>
    );
}

export default App;
