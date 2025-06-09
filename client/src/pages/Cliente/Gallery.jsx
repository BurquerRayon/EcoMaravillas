import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../../components/Carousel";
import "../../styles/Gallery.css";
import Footer from "../../components/Footer";
import "../../styles/Footer.css";

const Galeria = () => {
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [filtroHabitat, setFiltroHabitat] = useState("");
  const [especieSeleccionada, setEspecieSeleccionada] = useState(null);
  const navigate = useNavigate();

  const imagenes = [
    {
      nombre: "Cigua cara amarilla",
      especie: "Cigua cara amarilla",
      habitat: "Área Exterior",
      caracteristica:
        "Especie residente. Es común verla posada en las cercas de alambres de púas y en ramitas secas amontonadas. El nido es una pequeña copa o globular ubicado cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Cigua.jpg",
    },
    {
      nombre: "Pajaro Bob",
      especie: "Pajaro Bob",
      habitat: "Área Exterior",
      src: "/assets/img/Fauna/Bob.jpg",
    },
    {
      nombre: "Lechuza cara ceniza",
      especie: "Tyto glaucops",
      habitat: "Cueva",
      habitat: "Área Exterior",
      src: "/assets/img/Fauna/Tyto.jpg",
    },
    // Agrega más imágenes si lo deseas...
  ];

  const resultados = imagenes.filter((img) => {
    const especieMatch = !filtroEspecie || img.especie === filtroEspecie;
    const habitatMatch = !filtroHabitat || img.habitat === filtroHabitat;
    return especieMatch && habitatMatch;
  });

  const hayFiltros = filtroEspecie || filtroHabitat;

  return (
    <div className="page-wrapper">
      <main className="content">
        <div className="galeria-container">
          <button className="btn-salir" onClick={() => navigate("/")}>
            ← Volver al Inicio
          </button>

          <h1>Galería de Especies</h1>
          <p>
            Explora nuestras imágenes rotativas o filtra por especie/hábitat:
          </p>

          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="filter-especie">Filtrar por especie</label>
              <select
                id="filter-especie"
                onChange={(e) => setFiltroEspecie(e.target.value)}
              >
                <option value="">Todas las especies</option>
                <option value="Cigua cara amarilla">Cigua cara amarilla</option>
                <option value="Pajaro Bob">Pajaro Bob</option>
                <option value="Lechuza cara ceniza">Lechuza cara ceniza</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-habitat">Filtrar por hábitat</label>
              <select
                id="filter-habitat"
                onChange={(e) => setFiltroHabitat(e.target.value)}
              >
                <option value="">Todos los hábitats</option>
                <option value="cueva">Cueva</option>
                <option value="Área Ácuatica">Área Ácuatica</option>
                <option value="Área Exterior">Área Exterior</option>
              </select>
            </div>
          </div>

          {!hayFiltros ? (
            <div className="carousel-container">
              <Carrusel />
            </div>
          ) : (
            <div className="resultados-grid">
              {resultados.length > 0 ? (
                resultados.map((img, idx) => (
                  <div
                    className="result-card"
                    key={idx}
                    onClick={() => setEspecieSeleccionada(img)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={img.src}
                      alt={img.nombre}
                      className="result-img"
                    />
                    <h3>{img.nombre}</h3>
                    <p>
                      <strong>Especie:</strong> {img.especie}
                    </p>
                    <p>
                      <strong>Hábitat:</strong> {img.habitat}
                    </p>
                  </div>
                ))
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          )}

          {/* Vista detallada al hacer clic */}
          {especieSeleccionada && (
            <div className="detalle-especie">
              <button
                className="btn-cerrar"
                onClick={() => setEspecieSeleccionada(null)}
              >
                X
              </button>
              <img
                src={especieSeleccionada.src}
                alt={especieSeleccionada.nombre}
                className="imagen-detalle"
              />
              <h2>{especieSeleccionada.nombre}</h2>
              <p>
                <strong>Nombre científico:</strong>{" "}
                {especieSeleccionada.especie}
              </p>
              <p>
                <strong>Hábitat:</strong> {especieSeleccionada.habitat}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Galeria;
