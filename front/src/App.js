import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/notFound";
import ForgotPassword from './pages/ForgotPassword';
import Profile from "./pages/profile";
import MyEditor from "./pages/MyEditor";
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
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
