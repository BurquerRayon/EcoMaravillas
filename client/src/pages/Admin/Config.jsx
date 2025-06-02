import React from 'react';
import '../../styles/ConfigAdmin.css';
import { Link } from 'react-router-dom';

const Config = () => {
  return (
    <div className="ajustes-container">
      <div className="config-header">
        <h2>Configuraciones del Sistema</h2>
        <Link to="/admin/dashboard" className="dashboard-button">
          Volver al Dashboard
        </Link>
      </div>

      <div className="ajuste-grid">
        <Link to="/admin/ajustes/roles" className="ajuste-card">Gestión de Roles</Link>
        <Link to="/admin/ajustes/permisos" className="ajuste-card">Permisos</Link>
        <Link to="/admin/ajustes/atracciones" className="ajuste-card">Atracciones</Link>
        <Link to="/admin/ajustes/monedas" className="ajuste-card">Monedas</Link>
        <Link to="/admin/ajustes/reportes" className="ajuste-card">Tipos de Reporte</Link>
        <Link to="/admin/ajustes/nacionalidades" className="ajuste-card">Nacionalidades</Link>
        <Link to="/admin/ajustes/nacionalidades" className="ajuste-card">Horarios</Link>
      </div>
    </div>
  );
};

export default Config;