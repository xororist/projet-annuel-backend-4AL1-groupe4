import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/notFound";
import ForgotPassword from './pages/ForgotPassword';
import Profile from "./pages/profile";
import MyEditor from "./pages/MyEditor";
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext'; /**To wrap all the component which required user connected information. help to export user for others component*/
import AuthProvider from './contexts/AuthContext';


function App() {
  const [user, setUser] = useState(null);

  

  const handleSignOut = () => {
    // setUser(null);
    alert(localStorage.getItem('token'));
    localStorage.removeItem('token');
  };



  return (
    <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/editor" element={<MyEditor />} />


            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;