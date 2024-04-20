// Navbar.js

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar({ user, onSignOut }) {
  const activeLink = "text-white px-3 py-2 rounded-md text-sm font-medium";
  const normalLink = "text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const loginicon ='../../../public/logo512.png';
  const dropdownRef = useRef(null); // Utilisation du hook useRef
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Utilisation du hook useEffect

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSignOut = () => {
    onSignOut();
    setDropdownOpen(false);
    navigate("/login"); // Naviguer vers la page de login après la déconnexion
  };

  const handleHomeClick = (e) => {
    if (!user) {
      e.preventDefault(); // Arrête la navigation par défaut
      navigate("/not-found");
    }
  };
  
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-lg font-semibold" onClick={handleHomeClick}>
          MonApp
        </a>

        <div className="flex items-center">
          <div className="flex flex-row">
          <a href="/home" className={normalLink} onClick={(e) => handleHomeClick(e)}>Home</a>
            <a href="/login" className={normalLink}>Login</a>
            <a href="/register" className={normalLink}>Register</a>
          </div>
          <div className="relative ml-auto mr-4" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="focus:outline-none">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                {user && (
                  <img src={loginicon} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Modifier Profil</a>
                <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Déconnexion <FaSignOutAlt className="inline-block ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
