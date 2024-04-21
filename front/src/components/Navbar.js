import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import { useAuth } from '../contexts/AuthContext';

import  isAuthenticated from '../functions/TokenManager';
function Navbar() {

    const activeLink = "text-white px-3 py-2 rounded-md text-sm font-medium";
    const normalLink = "text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const [authenticated, setAuthenticated] = useState(false);

    const auth = useAuth();
    // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // const handleSignOut = () => {
    //   // onSignOut();
    //   toggleDropdown();
    // };

	useEffect(() => {
		if (isAuthenticated() && auth.token) {
			setAuthenticated(true);
		} else {
			setAuthenticated(false);
		}
		
	}, [auth.token]);


	return (
		<nav className="bg-gray-800 p-4 fixed top-0 w-full z-10">
		<div className="container mx-auto flex justify-between items-center">
				
				<NavLink to="/" className="text-white text-lg font-semibold">MonApp</NavLink>
		
				<div className="flex flex-row">
					<NavLink to="/home" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Home</NavLink>

					{authenticated ?
					(
						<>
						<NavLink to="/profile" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Profile</NavLink>
						<NavLink onClick={() => auth.logOut()} to="/login" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Logout</NavLink>
						</>
					): 
					(
						<>
						<NavLink to="/login" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Login</NavLink>
			
						<NavLink to="/register" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Register</NavLink> 
						</>
					)}
				</div>
		</div>
		</nav>
	);
}

export default Navbar;
