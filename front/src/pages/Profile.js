import React, { useEffect, useState } from 'react';
import { currentUser } from '../services/api.user';


function Profile() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	async function loadUser() {
		const ress = await currentUser()
		setUser(ress.data)
		setIsLoading(false)
	}

	useEffect(() => {
		loadUser()
	}, []);
	return (
		<div className="container mx-auto mt-20">
			<div className='mb-8'>
			
				{isLoading ? ( // Vérifier si le chargement est en cours
					<p>Loading...</p>
				) : user ? ( // Vérifier si l'utilisateur est disponible
					<h1>Welcome! {user.username}</h1>
				) : ( // Afficher un message si aucun utilisateur n'est disponible
					<p>No user data available.</p>
				)}
			
			</div>
		</div>);
	}
export default Profile;