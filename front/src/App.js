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
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  return (
      <UserProvider>
        <Router>
          <Navbar user={user} onSignOut={handleSignOut} />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute user={user} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/editor" element={<MyEditor />} />
            </Route>

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
  );
}

export default App;
