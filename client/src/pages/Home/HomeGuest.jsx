import React from 'react';
import '../../styles/HomeGuest.css';
import Carrusel from '../../components/Carousel'; // ajusta la ruta según ubicación

const HomeGuest = () => {
  return (
    <div className="home-guest-container">
      <section className="hero">
        <h1>Bienvenido a EcoMaravillas</h1>
          <p>Explora, reserva y descubre la naturaleza.</p>
            <div className="home-buttons">

              <button className="map-button" onClick={() => window.location.href = '/map'}>
                Ver Mapa de Atracciones y Hábitats
              </button>

                <button className="gallery-button" onClick={() => window.location.href = '/gallery'}>
                  Galería de Especies
                </button>
              </div>
      </section>

      <section className="hero2">
        <h1>Exploremos una Maravilla Natural</h1>
        <h3> </h3>
          <div>
            {/* Carrusel visual */}
              <Carrusel />
          </div>
      </section>

      <footer>
        <p>&copy; 2025 EcoMaravillas - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default HomeGuest;
