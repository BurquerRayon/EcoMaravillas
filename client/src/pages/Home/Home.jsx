import React from 'react';
import HomeGuest from './HomeGuest';
import HomeClient from './HomeClient';
import HomeEmployee from './HomeEmployee';
import { useAuth } from '../../context/AuthContext'; // Añadir

const Home = () => {
  const { user } = useAuth(); // Cambiar esto

  if (!user) {
    return <HomeGuest />;
  }

  if (user.rol === 'cliente') { // Corregir de 'role' a 'rol'
    return <HomeClient />;
  }

  if (user.rol === 'empleado') {
    return <HomeEmployee />;
  }

  return <HomeGuest />;
};

export default Home;