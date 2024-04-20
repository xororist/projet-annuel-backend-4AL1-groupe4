import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/notFound";
import ForgotPassword from './pages/ForgotPassword';
import Profile from "./pages/profile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  return (
    <Router>
      <Navbar user={user} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/not-found" element={<NotFound />} /> 

      </Routes>
    </Router>
  );
}

export default App;
