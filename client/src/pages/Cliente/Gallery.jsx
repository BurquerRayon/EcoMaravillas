import React, { useState } from 'react';
import Carrusel from '../../components/Carousel';
import '../../styles/Gallery.css';

const Galeria = () => {
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [filtroHabitat, setFiltroHabitat] = useState('');

  const imagenes = [
    { nombre: 'Iguana Verde', especie: 'iguana', habitat: 'Área Exterior', src: '/assets/img/I1.jpeg' },
    { nombre: 'Murciélago Café', especie: 'murciélago', habitat: 'cueva', src: '/assets/img/I2.jpeg' },
    { nombre: 'Serpiente Roja', especie: 'serpiente', habitat: 'Área Exterior', src: '/assets/img/I3.jpeg' },
    // ... más imágenes
  ];

  // Filtro aplicado
  const resultados = imagenes.filter((img) => {
    const especieMatch = !filtroEspecie || img.especie === filtroEspecie;
    const habitatMatch = !filtroHabitat || img.habitat === filtroHabitat;
    return especieMatch && habitatMatch;
  });

  const hayFiltros = filtroEspecie || filtroHabitat;

  return (
    <div className="galeria-container">
      <h1>Galería de Especies</h1>
      <p>Explora nuestras imágenes rotativas o filtra por especie/hábitat:</p>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="filter-especie">Filtrar por especie</label>
          <select id="filter-especie" onChange={(e) => setFiltroEspecie(e.target.value)}>
            <option value="">Todas las especies</option>
            <option value="iguana">Iguana</option>
            <option value="murciélago">Murciélago</option>
            <option value="serpiente">Serpiente</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-habitat">Filtrar por hábitat</label>
          <select id="filter-habitat" onChange={(e) => setFiltroHabitat(e.target.value)}>
            <option value="">Todos los hábitats</option>
            <option value="cueva">Cueva</option>
            <option value="Área Ácuatica">Área Ácuatica</option>
            <option value="Área Exterior">Área Exterior</option>
          </select>
        </div>
      </div>

      {/* Muestra el carrusel solo si no hay filtros */}
      {!hayFiltros ? (
        <div className="carousel-container">
          <Carrusel />
        </div>
      ) : (
        <div className="resultados-grid">
          {resultados.length > 0 ? (
            resultados.map((img, idx) => (
              <div className="result-card" key={idx}>
                <img src={img.src} alt={img.nombre} className="result-img" />
                <h3>{img.nombre}</h3>
                <p><strong>Especie:</strong> {img.especie}</p>
                <p><strong>Hábitat:</strong> {img.habitat}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Galeria;
