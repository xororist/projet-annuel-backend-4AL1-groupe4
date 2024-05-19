import React, { useContext, useState, useEffect } from 'react';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';
import userProfileImage from '../assets/photos/loginicon.jpg';
import { updateUserInformation } from '../services/api.user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserData({
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                password: user.password
            });
        }
    }, [user]);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'first_name' || name === 'last_name') {
            if (!value || value.length < 2 || !isNaN(value)) {
                error = `${name.replace('_', ' ')} must be at least 2 characters long and cannot be a number.`;
            }
        }
        if (name === 'username') {
            if (!value) {
                error = 'Username is required.';
            }
        }
        if (name === 'email') {
            if (!value || !/\S+@\S+\.\S+/.test(value)) {
                error = 'Email is invalid.';
            }
        }
        if (name === 'password') {
            if (!value || value.length < 8) {
                error = 'Password must be at least 8 characters long.';
            }
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
        validateField(name, value);
    };

    const validate = () => {
        let tempErrors = {};
        validateField('first_name', userData.first_name);
        validateField('last_name', userData.last_name);
        validateField('username', userData.username);
        validateField('email', userData.email);
        validateField('password', userData.password);
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {

                const { password, ...data } = userData;
                if (!userData.password) {
                    delete data.password;
                }
                const response = await updateUserInformation(user.id, userData);
                setUser(response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile updated successfully!',
                });
            } catch (error) {
                console.error("Error updating profile", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating your profile. Please try again later.',
                });
            }
        }
    };

    const ContactAvatar = ({ name }) => (
        <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <p className="text-gray-700 text-sm mt-2">{name}</p>
        </div>
    );

    const TeamCard = ({ teamName }) => (
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-center">
            <p className="text-gray-700">{teamName}</p>
        </div>
    );

    const handleHomeClick = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative mt-12">
            <div className="relative bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row w-full max-w-6xl justify-center align-middle items-center">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full hover:bg-red-700 transition duration-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                    <img src={userProfileImage} alt="User" className="rounded-full h-32 w-32" />
                    <h2 className="text-2xl font-bold mt-4">{user?.first_name} {user?.last_name}</h2>
                    <p className="text-gray-500">Security Lead</p>
                    <button className="mt-4 flex items-center text-blue-500 hover:text-blue-700">
                        <FaUserPlus className="mr-2" /> Follow
                    </button>
                    <div className="mt-8">
                        <ul className="text-gray-700">
                            <li className="py-1">Profile</li>
                            <li className="py-1">Tasks</li>
                            <li className="py-1">Calendar</li>
                            <li className="py-1">Files</li>
                        </ul>
                    </div>
                </div>
                <div className="w-full md:w-2/3 mt-8 md:mt-0 md:ml-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={user?.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                            Valider
                        </button>
                    </form>
                    <h3 className="text-xl font-bold mt-8 mb-4">Connexion récente</h3>
                    <div className="flex space-x-4">
                        <ContactAvatar name="Joe A." />
                        <ContactAvatar name="Dylan C." />
                        <ContactAvatar name="Ethan C." />
                        <ContactAvatar name="Louis W." />
                        <ContactAvatar name="Jacob S." />
                        <ContactAvatar name="Katie U." />
                    </div>
                    <h3 className="text-xl font-bold mt-8 mb-4">3 dernières publications...</h3>
                    <div className="flex space-x-4">
                        <TeamCard teamName="Product Team" />
                        <TeamCard teamName="Security Team" />
                        <TeamCard teamName="Japan Team" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
