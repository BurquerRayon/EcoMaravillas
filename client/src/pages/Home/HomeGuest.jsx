import React from 'react';
import '../../styles/HomeGuest.css';
import Carrusel from '../../components/Carousel';
import Footer from '../../components/Footer';
import { FaLeaf, FaMapMarkedAlt, FaImage, FaInfoCircle } from 'react-icons/fa';

const HomeGuest = () => {
return (
  <div className="page-wrapper">
    <main className="content">
      <section className="hero">
        <h1>Bienvenido a EcoMaravillas</h1>
        <p>Conéctate con la naturaleza de forma única y sostenible.</p>
        <div className="home-buttons">
          <button className="map-button" onClick={() => window.location.href = '/map'}>
            <FaMapMarkedAlt /> Ver Mapa de Atracciones y Hábitats
          </button>

          <button className="gallery-button" onClick={() => window.location.href = '/gallery'}>
            <FaImage /> Galería de Especies
          </button>
        </div>
      </section>

      <section className="info-section">
        <h2>¿Qué es EcoMaravillas?</h2>
        <p>
          EcoMaravillas es un destino turístico ecológico que combina aventura, educación ambiental
          y conservación. Aquí puedes reservar experiencias únicas en hábitats naturales y descubrir
          la biodiversidad que nos rodea.
        </p>
      </section>

    <section className="benefits-section">
      <h2>¿Por qué visitarnos?</h2>
      <div className="benefits-grid">
        <div className="benefit-card">
          <FaLeaf className="icon" />
          <h3>Turismo Sostenible</h3>
          <p>Apoya proyectos de conservación y educación ambiental.</p>
        </div>
        <div className="benefit-card">
          <FaMapMarkedAlt className="icon" />
          <h3>Aventuras Inolvidables</h3>
          <p>Recorre senderos, hábitats naturales y reservas protegidas.</p>
        </div>
        <div className="benefit-card">
          <FaInfoCircle className="icon" />
          <h3>Educación Ambiental</h3>
          <p>Aprende sobre especies nativas y su ecosistema.</p>
        </div>
      </div>
    </section>

    <section className="carousel-section">
      <h2>Explora Visualmente</h2>
      <Carrusel />
    </section>

    <section className="cta-section">
      <h2>¿Listo para vivir la experiencia?</h2>
      <p>Reserva tu próxima aventura ecológica en solo unos clics.</p>
      <button className="cta-button" onClick={() => window.location.href = '/registro'}>
        Crear Cuenta / Reservar
      </button>
    </section>

  </main>
  <Footer />
</div>
);
};

export default HomeGuest;