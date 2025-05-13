import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa el hook de autenticación
import '../../styles/Home.css';
import '../../styles/HomeClient.css';
import '../../styles/HomeGuest.css';

const HomeClient = () => {
  const { user } = useAuth(); // Obtiene el usuario del contexto

  return (
    <div className="home-container">
      {/* Muestra el nombre del usuario si está disponible */}
      <h1>Hola, {user?.nombre || 'Cliente'}</h1>
      <p></p>

      <section className="features">
        <h2>Reserva en línea con facilidad</h2>
        <ul>
          <h3>Reserva en línea con facilidad</h3>
          <h3>Accede a rutas ecológicas certificadas</h3>
          <h3>Reportes ambientales actualizados</h3>          
          <li></li>
        </ul>

        <button className="reserve-button" onClick={() => window.location.href = '/reservas'}>
          Reservar ahora
        </button>
      </section>

      <ul>
        <h3>🔎 Explorar reservas</h3>
        <h3>📅 Ver tus reservas</h3>
        <h3>📝 Modificar perfil</h3>
      </ul>
    </div>
  );
};

export default HomeClient;