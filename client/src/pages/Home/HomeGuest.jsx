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

      <section className="about">
        <h2>¿Qué es EcoMaravillas?</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="about">
        <h2>Mision</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="about">
        <h2>Visision</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="about">
        <h2>Valores</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="hero2">
        <h1>Exploremos una Maravilla Natural</h1>
        <h3> </h3>
          <div>
            {/* Carrusel visual */}
              <Carrusel />
            {/* Aquí puedes seguir con más contenido */}
          </div>
      </section>

      <footer>
        <p>&copy; 2025 EcoMaravillas - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default HomeGuest;
