import React from 'react';
import HomeGuest from './HomeGuest';
import HomeClient from './HomeClient';
import HomeEmployee from './HomeEmployee';

const Home = () => {
  // Suponiendo que tienes un contexto o estado para auth
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <HomeGuest />;
  }

  if (user.role === 'cliente') {
    return <HomeClient />;
  }

  if (user.role === 'empleado') {
    return <HomeEmployee />;
  }

  // Fallback por si el rol no está bien definido
  return <HomeGuest />;
};

export default Home;
