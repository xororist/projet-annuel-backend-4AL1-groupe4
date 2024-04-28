import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";  
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { notifySuccess, notifyError } from '../functions/toast'
import { createUser } from '../services/api.auth.user';

function RegistrationForm() {

        const [formData, setFormData] = useState({
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        const [passwordShown, setPasswordShown] = useState(false);
        const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
        const [touched, setTouched] = useState({
            password: false,
            confirmPassword: false
        });
        const navigate = useNavigate();
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
            setTouched({ ...touched, [e.target.name]: true });
        };
    
        const togglePasswordVisibility = () => {
            setPasswordShown(!passwordShown);
        };
    
        const toggleConfirmPasswordVisibility = () => {
            setConfirmPasswordShown(!confirmPasswordShown);
        };
    
        const handleReset = () => {
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setTouched({
                password: false,
                confirmPassword: false
            });
        };
    
        const  handleSubmit = async (e) => {
            e.preventDefault();
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords don't match.");
            } else if (formData.password.length < 12) {
                alert("Password must be at least 12 characters.");
            } else {
                console.log('Form Data Submitted:', formData);
                try {
                    formData.password2 = formData.confirmPassword
                    const res = await createUser(formData)
                    notifySuccess("Registration Successfully completed!");
                    navigate("/login");
                } catch (error) { 
                    if (error.response) {
                        if (error.response.status == 400) {
                            for (const key in error.response.data) {
                                const valeur = error.response.data[key];
                                notifyError(`${key}: ${valeur}`);
                            }
                        } else if(error.message) {
                            notifyError(error.message);
                        }
                    
                    } else if (error.request) {
                    console.log(error.request);
                    } else {
                        notifyError(error.message);
                    }
                }
            }
        };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md space-y-4 w-full max-w-lg">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name:</label>
                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                    <input type={passwordShown ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${formData.password.length >= 12 ? "border-green-500" : "border-red-500"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500`}
                        required />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        {passwordShown ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {touched.password && formData.password.length < 12 && <p className="text-red-500 text-xs mt-1">Password must be at least 12 characters.</p>}
                </div>

                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                    <input type={confirmPasswordShown ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${formData.confirmPassword.length >= 12 ? "border-green-500" : "border-red-500"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500`}
                        required />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        {confirmPasswordShown ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {touched.confirmPassword && formData.confirmPassword.length < 12 && <p className="text-red-500 text-xs mt-1">Password must be at least 12 characters.</p>}
                </div>
                <div>
                    <button type="submit" className="w-full mb-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Register
                    </button>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
