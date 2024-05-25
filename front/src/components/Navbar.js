import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaGlobe, FaMoon, FaUserEdit,FaFileAlt } from "react-icons/fa";
import { googleLogout } from '@react-oauth/google';
import loginicon from '../logo.svg'; // Image par défaut
import { UserContext } from "../contexts/UserContext";

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("fr");
    const [searchTerm, setSearchTerm] = useState('');
    const profileDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const navigate = useNavigate();

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
    }, []);

    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        googleLogout();
        navigate("/login");
    };

    const handleHomeClick = () => {
        if (user && user.username) {
            navigate("/home");
        } else {
            navigate("/not-found");
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const changeLanguage = (lang) => {
        setLanguage(lang);
        setLanguageDropdownOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        navigate('/home', { state: { searchTerm } });
    };

    return (
        <nav className={`bg-gray-800 p-4 fixed top-0 w-full z-10 ${darkMode ? 'text-white' : 'text-gray-400'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-lg font-semibold" onClick={handleHomeClick}>
                    MonApp
                </a>
                <div className="flex items-center space-x-4 ml-8 w-3/5">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Recherche..."
                        className="flex-grow p-2 border rounded border-gray-300"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Valider
                    </button>
                </div>
                <div className="flex items-center ml-auto">
                    <div className="flex flex-row">
                        <a href="/home"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                           onClick={handleHomeClick}>Home</a>
                        {!user && <a href="/login"
                                     className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>}
                        <a href="/editor"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Editor</a>

                        <a href="/pipeline"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pipeline</a>

                    </div>
                    {user && (
                        <>
                            <div className="relative ml-4" ref={profileDropdownRef}>
                                <button
                                    onMouseEnter={() => setProfileDropdownOpen(true)}
                                    className="focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                        <img src={user.profile_picture || loginicon} alt="Profile"
                                             className="w-full h-full object-cover"/>
                                    </div>
                                </button>
                                {profileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg"
                                        onMouseEnter={() => setProfileDropdownOpen(true)}
                                        onMouseLeave={() => setProfileDropdownOpen(false)}
                                    >
                                        <a href="/profile"
                                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                            <FaUserEdit className="mr-2"/> Modifier Profil
                                        </a>
                                        <a href="/programmes"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                            <FaFileAlt className="mr-2"/> Programmes
                                        </a>

                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2"/> Déconnexion
                                        </button>
                                     
                                    </div>
                                )}
                            </div>
                            <span className="text-gray-400 ml-4">{user?.first_name} {user?.last_name}</span>
                        </>
                    )}
                    <div className="relative ml-4 flex items-center" ref={languageDropdownRef}>
                        <button
                            onMouseEnter={() => setLanguageDropdownOpen(true)}
                            className="focus:outline-none"
                        >
                            <FaGlobe className={`inline-block ${languageDropdownOpen ? 'text-blue-500' : ''}`}
                                     style={{fontSize: '1.3rem'}}/>
                            <span className="ml-1">{language.toUpperCase()}</span>
                        </button>
                        {languageDropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg"
                                onMouseEnter={() => setLanguageDropdownOpen(true)}
                                onMouseLeave={() => setLanguageDropdownOpen(false)}
                            >
                                <button onClick={() => changeLanguage('fr')}
                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">FR
                                </button>
                                <button onClick={() => changeLanguage('en')}
                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">EN
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={toggleDarkMode} className="ml-4 focus:outline-none">
                        <FaMoon className={`inline-block ${darkMode ? 'text-white' : 'text-gray-400'}`}
                                style={{fontSize: '1.5rem'}}/>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
