import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ReportDetail.css';

const DetalleReporte = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const volver = () => {
    navigate('/admin/reportes');
  };

  return (
    <div className="detalle-reporte">
      <h2>Detalle del Reporte #{id}</h2>
      <div className="contenido-detalle">
        <p><strong>Tipo:</strong> Ventas</p>
        <p><strong>Rango de fechas:</strong> 01/04/2025 - 10/04/2025</p>
        <p><strong>Ventas totales:</strong> RD$ 150,000</p>
        <p><strong>Boletos vendidos:</strong> 450</p>
        <p><strong>Promedio por día:</strong> RD$ 16,666</p>
        {/* Puedes agregar más datos aquí */}
      </div>
      <button className="volver" onClick={volver}>Volver a Reportes</button>
    </div>
  );
};

export default DetalleReporte;
