import React from 'react';
import '../../styles/AdminHome.css';

const AdminHome = () => {
  return (
    <div className="admin-home-container">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, administrador. Desde aquí puedes gestionar las operaciones del sistema.</p>

      <div className="admin-grid">
        <div className="admin-card">🧾 Reservas</div>
        <div className="admin-card">🗺️ Atracciones</div>
        <div className="admin-card">📊 Reportes</div>
        <div className="admin-card">👤 Usuarios</div>
      </div>
    </div>
  );
};

export default AdminHome;
