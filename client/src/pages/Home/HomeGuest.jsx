import React from 'react';
import Img1 from '../../assets/img/I1.jpeg'; // Importando las imágenes
import Img2 from '../../assets/img/I2.jpeg';
import Img3 from '../../assets/img/I3.jpeg';

const HomeGuest = () => {
  return (
    <div className="home-guest-container">
      <section className="hero">
        <h1>Bienvenido a EcoMaravillas</h1>
        <p>Explora, reserva y descubre la naturaleza.</p>
        <button>Explorar rutas</button>
      </section>

      <section className="about">
        <h2>¿Qué es EcoMaravillas?</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="features">
        <h2>Funciones destacadas</h2>
        <ul>
          <li>Reserva en línea con facilidad</li>
          <li>Accede a rutas ecológicas certificadas</li>
          <li>Reportes ambientales actualizados</li>
        </ul>
      </section>

      <section className="gallery">
        <h2>Destinos ecológicos</h2>
        <div className="gallery-images">
          <img src={Img1} alt="Lugar 1" />
          <img src={Img2} alt="Lugar 2" />
          <img src={Img3} alt="Lugar 3" />
        </div>
      </section>

      <footer>
        <p>&copy; 2025 EcoMaravillas - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default HomeGuest;
