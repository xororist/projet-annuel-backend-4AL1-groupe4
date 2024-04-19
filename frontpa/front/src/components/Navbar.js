import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar({ user, onSignOut }) {

  const activeLink = "text-white px-3 py-2 rounded-md text-sm font-medium";
  const normalLink = "text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSignOut = () => {
    onSignOut();
    toggleDropdown();
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
            
            <NavLink to="/" className="text-white text-lg font-semibold">MonApp</NavLink>
    
            <div class="flex flex-row">
                <NavLink to="/home" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Home</NavLink>
                <NavLink to="/login" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Register</NavLink>
            </div>
      </div>
    </nav>
  );
}

export default Navbar;
