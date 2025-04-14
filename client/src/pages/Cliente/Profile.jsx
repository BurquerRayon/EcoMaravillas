import React from 'react';
import '../../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const ClientePerfil = () => {
  const navigate = useNavigate();

  const handleEditarPerfil = () => {
    navigate('/config'); // Ruta a la página de configuración del cliente
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h1>Mi Perfil</h1>
        <div className="perfil-info">
          <p><strong>Nombre:</strong> Juan Pérez</p>
          <p><strong>Email:</strong> juanperez@email.com</p>
          <p><strong>Teléfono:</strong> +1 829 555 1234</p>
          <p><strong>Método de pago:</strong> **** **** **** 1234</p>
        </div>
        <button className="btn-editar" onClick={handleEditarPerfil}>
          Editar configuración de cuenta
        </button>
      </div>
    </div>
  );
};

export default ClientePerfil;
