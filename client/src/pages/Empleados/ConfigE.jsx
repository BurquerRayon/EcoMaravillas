import React from 'react';
import '../../styles/ConfigE.css';

const Config = () => {
  return (
<div className="config-container">
      <h2 className="config-title">Configuración del Sistema</h2>

      <div className="config-section">
        <h3>Información del Sistema</h3>
        <div className="form-group">
          <label>Nombre del sistema:</label>
          <input type="text" defaultValue="EcoMaravillas" />
        </div>
        <div className="form-group">
          <label>Versión:</label>
          <input type="text" defaultValue="1.0.0" disabled />
        </div>
      </div>

      <div className="config-section">
        <h3>Preferencias Generales</h3>
        <div className="form-group">
          <label>Idioma:</label>
          <select defaultValue="es">
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>
        <div className="form-group">
          <label>Zona Horaria:</label>
          <input type="text" defaultValue="GMT-4 (Rep. Dominicana)" />
        </div>
      </div>

      <div className="config-section">
        <h3>Notificaciones</h3>
        <div className="form-group checkbox">
          <input type="checkbox" id="emailAlerts" defaultChecked />
          <label htmlFor="emailAlerts">Habilitar alertas por correo</label>
        </div>
        <div className="form-group checkbox">
          <input type="checkbox" id="smsAlerts" />
          <label htmlFor="smsAlerts">Habilitar alertas por SMS</label>
        </div>
      </div>

      <div className="config-section">
        <h3>Seguridad</h3>
        <div className="form-group">
          <label>Tiempo de inactividad (minutos):</label>
          <input type="number" defaultValue={15} />
        </div>
        <div className="form-group checkbox">
          <input type="checkbox" id="forcePassword" />
          <label htmlFor="forcePassword">Solicitar cambio de contraseña cada 90 días</label>
        </div>
      </div>

      <div className="config-actions">
        <button className="btn-save">Guardar Cambios</button>
      </div>
    </div>
  );
};

export default Config;
