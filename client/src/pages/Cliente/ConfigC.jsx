import React, { useState } from 'react';
//import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';


const ConfigCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    preferencias: '',
    tarjetaCredito: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    alert('Configuración actualizada con éxito.');
    navigate('/perfil');
    e.preventDefault();
    // Aquí se puede integrar la lógica para enviar datos al backend
  };

  return (
    <div className="config-container">
      <h2>Configuración de Cuenta</h2>
      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Preferencias:</label>
          <textarea
            name="preferencias"
            value={formData.preferencias}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Número de Tarjeta de Crédito:</label>
          <input
            type="text"
            name="tarjetaCredito"
            value={formData.tarjetaCredito}
            onChange={handleChange}
            required
            maxLength="16"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-guardar">Guardar Cambios</button>
          <button type="button" className="btn-cancelar" onClick={() => window.history.back()}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ConfigCliente;
