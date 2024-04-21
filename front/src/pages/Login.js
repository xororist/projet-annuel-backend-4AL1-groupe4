import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useContext } from 'react'; 
import { UserContext } from '../contexts/UserContext'; // Mette
import { useForm } from 'react-hook-form';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function LoginPage() {
    const { user,  setUser } = useContext(UserContext);
    const {register, handleSubmit, formState: {
		errors
    } } = useForm();
	const auth = useAuth();

    const onSubmit = handleSubmit(async (data) => {
		console.log(data)
		auth.loginAction(data);
		return;


    });

    const handleOAuthLogin = (credentialResponse) => {
		try {
			const decoded = jwtDecode(credentialResponse.credential);
			console.log(decoded);
			setUser(decoded); // Mise à jour de l'état global de l'utilisateur
		} catch (error) {
			console.error('Failed to decode or set user', error);
		}
    };


	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
				<h3 className="text-2xl font-bold text-center">Connectez-vous à votre compte</h3>
				<ToastContainer />
				<form onSubmit={onSubmit}>
					<div className="mt-4">
						<label className="block" htmlFor="username">Nom d'utilisateur</label>
						<input type="text" placeholder="Nom d'utilisateur"
						id="username"
						{...register('username', {required: true})}
						className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
						/>
						<label className="block mt-4" htmlFor="password">Mot de passe</label>
						<input type="password" placeholder="Mot de passe"
						id="password"
						{...register('password', {required: true})}
						className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
						/>
						<div className="text-right">
							<p>
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Mot de passe oublié</Link>
							</p>
						</div>
						<button type="submit"
						className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Connexion</button>
					</div>
				</form>
				<div className="text-center">
					<p>Pas de compte?
						<Link to="/register" className="text-sm text-blue-600 hover:underline">S'inscrire</Link>
					</p>
					<p>Ou:</p>
				</div>
				<div className="flex items-center mt-6 -mx-2">
					<GoogleLogin
						onSuccess={handleOAuthLogin}
						onError={() => console.log('Login Failed')}
					>
						<button className="flex items-center px-4 py-2 mx-2 text-white bg-red-500 rounded-md hover:bg-red-700">
						<FaGoogle className="mr-2" /> Connexion avec Google
						</button>
					</GoogleLogin>
					<button onClick={() => handleOAuthLogin('GitHub')}
						className="flex items-center px-4 py-2 mx-2 text-white bg-gray-800 rounded-md hover:bg-black">
						<FaGithub className="mr-2" /> Connexion avec GitHub
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
