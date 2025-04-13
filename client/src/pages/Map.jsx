import React from 'react';
import '../styles/Map.css'; // Estilos personalizados opcionalmente

const Mapa = () => {
  return (
<div className="map-container">

      <h2 className="map-title">Mapa Interactivo</h2>
      
      <div className="map-box">
        <div className="map-background">
          <p className="map-placeholder-text">[Aquí se mostraría el mapa]</p>
          
          {/* Ejemplo de marcadores visuales */}
          <div className="map-marker" style={{ top: '30%', left: '40%' }} title="Punto A" />
          <div className="map-marker" style={{ top: '60%', left: '55%' }} title="Punto B" />
        </div>

        {/* Panel lateral simulado */}
        <div className="map-sidebar">
          <h4>Lugares disponibles:</h4>
          <ul>
            <li>🦎 Área de iguanas</li>
            <li>🌳 Zona ecológica</li>
            <li>🦜 Avistamiento de aves</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
