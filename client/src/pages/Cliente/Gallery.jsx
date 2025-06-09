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
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null); //estado para mostrar caracteristica//

  const imagenes = [
    //IMAGENES DE FAUNA//
    {
      nombre: "Cigua cara amarilla",
      especie: "tiaris olivacea",
      habitat: "Área Exterior",
      caracteristica:
        "Especie residente. Es común verla posada en las cercas de alambres de púas y en ramitas secas amontonadas. El nido es una pequeña copa o globular ubicado cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Cigua.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Pajaro Bob",
      especie: "Surothera longirostris",
      habitat: "Área Exterior",
      caracteristica: " ",
      src: "/assets/img/Fauna/Bob.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    {
      nombre: "Lechuza cara ceniza",
      especie: "Tyto glaucops",
      habitat: "Cueva",
      habitat: "Área Exterior",
      caracteristica: " ",
      src: "/assets/img/Fauna/Tyto.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: " Gallito prieto ",
      especie: "Loxigilla violacea ",
      habitat: "Área Exterior",
      caracteristica: " ",
      src: "/assets/img/Fauna/Loxi.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Cuatro ojos ",
      especie: "Phaenicophilus palmarum",
      habitat: "Área Exterior",
      caracteristica: "",
      src: "/assets/img/Fauna/palmarun.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Marpesia eleuchea ",
      especie: "Nymphalidae",
      habitat: "Área Exterior",
      caracteristica: "",
      src: "/assets/img/Fauna/Marpesia.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa cola de golondrina de borde dorado",
      especie: "Battus polydamas",
      habitat: "Área Exterior",
      caracteristica: "",
      src: "/assets/img/Fauna/Polydamas.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "/assets/img/Fauna/Lechuza.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "/assets/img/Fauna/Lechuza.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "/assets/img/Fauna/Lechuza.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "/assets/img/Fauna/Lechuza.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    // Agrega más imágenes si lo deseas...
  ];

  const resultados = imagenes.filter((img) => {
    const especieMatch =
      filtroEspecie === "" ||
      filtroEspecie === "Todas" ||
      img.tipo === filtroEspecie;
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
              <label htmlFor="filter-tipo">Filtrar por especie</label>
              <select
                id="filter-tipo"
                onChange={(e) => setFiltroEspecie(e.target.value)}
              >
                <option value="Todas">Todas las especies</option>
                <option value="Fauna">Fauna</option>
                <option value="Flora">Flora</option>
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
                    /*onClick={() => setEspecieSeleccionada(img)} */
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
                    {img.caracteristica && (
                      <p>
                        <strong>Características:</strong> {img.caracteristica}
                      </p>
                    )}
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
              {especieSeleccionada.caracteristica && (
                <p>
                  <strong>Características:</strong>{" "}
                  {especieSeleccionada.caracteristica}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Galeria;
