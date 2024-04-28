import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaGlobe, FaMoon } from "react-icons/fa";
import loginicon from '../logo.svg';
import { useAuth } from "../contexts/AuthContext";
import isAuthenticated from "../functions/TokenManager";

function Navbar({ user, onSignOut }) {
  const activeLink = "text-white px-3 py-2 rounded-md text-sm font-medium";
  const normalLink = "text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // État du mode sombre
  const [language, setLanguage] = useState("fr"); // Langue sélectionnée
  const [authenticated, setAuthenticated] = useState(false);

  const profileDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const navigate = useNavigate();

  const auth = useAuth();
  const user = auth.user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    if (isAuthenticated() && auth.token) {
			setAuthenticated(true);
		} else {
			setAuthenticated(false);
		}
  }, [auth.token]);

  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const toggleLanguageDropdown = () => setLanguageDropdownOpen(!languageDropdownOpen);

  const handleSignOut = () => {
    auth.onSignOut();
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const handleHomeClick = (e) => {
    alert(e)
    // if (!user) {
    //   e.preventDefault();
    //   navigate("/not-found");
    // }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Appliquer les styles du mode sombre ou clair ici
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setLanguageDropdownOpen(false); // Fermer le menu déroulant de langue après avoir sélectionné la langue
    // Changer la langue de l'application ici
  };

  return (
      <nav className={`bg-gray-800 p-4 fixed top-0 w-full z-10 ${darkMode ? 'text-white' : 'text-gray-400'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-lg font-semibold" onClick={handleHomeClick}>
            MonApp
          </a>

          <div className="flex items-center">
            <div className="flex flex-row">
              <a href="/home" className={normalLink} onClick={(e) => handleHomeClick(e)}>Home</a>
              <a href="/login" className={normalLink}>Login</a>
              <a href="/editor" className={normalLink}>Editor</a>
            </div>
            <div className="relative ml-auto mr-4" ref={profileDropdownRef}>
              <button onClick={toggleProfileDropdown} className="focus:outline-none">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                  <img src={loginicon} alt="Profile" className="w-full h-full object-cover"/>
                </div>
              </button>
              {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Modifier Profil</a>
                    <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Déconnexion <FaSignOutAlt className="inline-block ml-2"/>
                    </button>
                  </div>
              )}
            </div>
            <div className="ml-4 flex items-center relative">
              <button onClick={toggleLanguageDropdown} className="focus:outline-none">
                <FaGlobe className={`inline-block ${languageDropdownOpen ? 'text-blue-500' : ''}`} style={{fontSize: '1.3rem'}}/>
                <span className="ml-1">{language.toUpperCase()}</span>
              </button>
              {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg" ref={languageDropdownRef}>
                    <button onClick={() => changeLanguage('fr')} className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">FR</button>
                    <button onClick={() => changeLanguage('en')} className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">EN</button>
                  </div>
              )}
            </div>
            <button onClick={toggleDarkMode} className="ml-4 focus:outline-none">
              <FaMoon className={`inline-block ${darkMode ? 'text-white' : 'text-gray-400'}`} style={{fontSize: '1.3rem'}}/>
            </button>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
