import React, { useState } from "react";
import "../styles/Carrusel.css"; // Asegúrate de que este CSS exista

const images = [
  "/assets/img/e1.jpeg",
  "/assets/img/e2.jpeg",
  "/assets/img/e3.jpeg",
  // Agrega más rutas según tus imágenes
];

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const imagenActual = images[currentIndex];

  return (
    <div className="carousel-container">
      <button className="nav-btn left" onClick={handlePrev}></button>

      <img
        src={imagenActual.src}
        alt={imagenActual.nombre}
        className="carousel-image"
      />

      <button className="nav-btn right" onClick={handleNext}></button>

      {/* Características visibles solo cuando hay una imagen seleccionada */}
      <div className="caracteristica-box">
        <h2>{imagenActual.nombre}</h2>
        <p>
          <strong>Características:</strong> {imagenActual.caracteristica}
        </p>
      </div>
    </div>
  );
};

export default Carrusel;
