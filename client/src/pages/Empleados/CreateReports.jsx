import React, { useState } from 'react';
import '../../styles/CreateReports.css';
import { useNavigate } from 'react-router-dom';

const CrearReporte = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const handleCrear = (e) => {
    e.preventDefault();
    setMensaje('✅ Reporte creado correctamente.');
    setTimeout(() => navigate('/admin/reportes'), 1500);
  };

  const handleCancelar = () => {
    navigate('/admin/reportes');
  };

  return (
    <div className="crear-reporte">
      <h2>Crear Nuevo Reporte</h2>
      <form onSubmit={handleCrear} className="formulario-reporte">
        <label>Tipo de Reporte</label>
        <select required>
          <option value="">Seleccione una opción</option>
          <option value="ventas">Ventas</option>
          <option value="ocupacion">Ocupación</option>
          <option value="boletos">Boletos Vencidos</option>
          <option value="eficiencia">Eficiencia Operativa</option>
        </select>

        <label>Fecha Inicial</label>
        <input type="date" required />

        <label>Fecha Final</label>
        <input type="date" required />

        <div className="botones">
          <button type="submit" className="crear">Crear Reporte</button>
          <button type="button" className="cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
};

export default CrearReporte;
