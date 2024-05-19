import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Assurez-vous que l'importation est correcte
import { getUserInformation } from '../services/api.user';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      getUserInformation(decoded.user_id).then(result => {
        setUser(result.data);
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
      <UserContext.Provider value={{ user, setUser: saveUser }}>
        {children}
      </UserContext.Provider>
  );
};
