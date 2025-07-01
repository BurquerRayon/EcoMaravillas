import React, { useEffect, useState } from "react";
import "../styles/Carrusel.css";

const images = [
  "/assets/img/Instituto/e1.jpeg",
  "/assets/img/Instituto/e2.jpeg",
  "/assets/img/Instituto/e4.jpg",
];

/*const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div
      className="carousel-container background-carousel"
      style={{
        backgroundImage: `url(${currentImage})`,
      }}
    ></div>
  );
}; */

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="carousel-fullscreen"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    />
  );
};

export default Carrusel;
