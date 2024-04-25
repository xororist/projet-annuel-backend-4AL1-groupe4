import React from "react";

import { forgotPassword } from '../services/api.auth.user';
import { useForm } from 'react-hook-form';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifySuccess ,notifyError } from '../functions/toast'
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const {register, handleSubmit, formState: {
		errors
    } } = useForm();


    const onSubmit = handleSubmit(async (data) => {
		console.log(data)
		try {
            const res = await forgotPassword(data)
            console.log(res)
			notifySuccess(res.data.message);
		} catch (error) { 
			if (error.response) {
				if (error.response.status == 401) {
					notifyError("Incorrect username or password");
				} else if(error.message) {
					notifyError(error.message);
				}
			} else if (error.request) {
				console.log(error.request);
			} else {
				notifyError(error.message);
			}
		}
    });

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <h3 className="text-2xl font-bold text-center">Récupération de mot de passe</h3>
                <ToastContainer />
                <form onSubmit={onSubmit}>
                    <div className="mt-4">
                        <label className="block" htmlFor="email">Email</label>
                        <input type="email" placeholder="Adresse email"
                        id="email"
                        {...register('email', {required: true})}
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        
                        <div className="text-right">
                            <p>
                                <Link to="/login" className="text-sm text-blue-600 hover:underline">Se Connecter</Link>
                            </p>
                        </div>
                        <button type="submit"
                        className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Récuperer</button>
                    </div>
                </form>
            </div>
		</div>
	);
}

export default LoginPage;
