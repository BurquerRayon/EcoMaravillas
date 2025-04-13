import React from 'react';
import '../../styles/Home.css';
import '../../styles/HomeClient.css';
import '../../styles/HomeGuest.css';

const HomeClient = () => (
  
  <div className="home-container">
    <h1>Hola, Cliente</h1>
    <p>Gracias por confiar en EcoMaravillas.</p>

    <section className="features">
      <h2>Reserva en línea con facilidad</h2>
        <ul>
          <li>Reserva en línea con facilidad</li>
          <li>Accede a rutas ecológicas certificadas</li>
          <li>Reportes ambientales actualizados</li>
        </ul>

        <button className="reserve-button" onClick={() => window.location.href = '/reservas'}>
          Reservar ahora
        </button>
    </section>

    <ul>
      <li>🔎 Explorar reservas</li>
      <li>📅 Ver tus reservas</li>
      <li>📝 Modificar perfil</li>
    </ul>
  </div>
);

export default HomeClient;



