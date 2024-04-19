import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import  { useState, useEffect } from 'react';


function App() {
  const [user, setUser] = useState(null);

  const handleSignOut = () => {
      // Logic to handle sign out
      setUser(null);
  };

  // Imagine that we have a function that logs in the user
  const handleLogin = (userInfo) => {
      setUser(userInfo);
  };

  return (
      <Router>
          <Navbar user={user} onSignOut={handleSignOut} />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
      </Router>
  );
}

export default App;
