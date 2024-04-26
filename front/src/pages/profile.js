
import React, { useContext } from "react";
import { UserContext } from '../contexts/UserContext';

const Profil = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-32">
      <div className="max-w-md w-full p-8 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Profil de {user.username}</h2>
        <p className="text-lg text-center text-gray-600 mb-8">Email: {user.email}</p>
        <p className="text-lg text-center text-gray-600 mb-8">Email: {user.email}</p>
        <p className="text-lg text-center text-gray-600 mb-8">Email: {user.email}</p>
        <p className="text-lg text-center text-gray-600 mb-8">Email: {user.email}</p>
        {/* Afficher d'autres informations de l'utilisateur ici si nécessaire */}
      </div>
    </div>
  );
};

export default Profil;
