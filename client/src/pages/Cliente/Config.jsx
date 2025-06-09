import React, { useState } from 'react';
import '../../styles/ClientConfig.css';
import DatosPC from '../Cliente/Config/DatosPersonales';
//import ContactoForm from './Cuenta/ContactoForm';
//import BancariaForm from './Cuenta/BancariaForm';
//import ContrasenaForm from './Cuenta/ContrasenaForm';
import { Link } from 'react-router-dom';

const ClienteAjustes = () => {
const [formularioActivo, setFormularioActivo] = useState(null);

const manejarSeleccion = (formulario) => {
setFormularioActivo((prev) => (prev === formulario ? null : formulario));
};

return (
<div className="ajustes-container">
<div className="config-header">
<h2>Ajustes de Cuenta</h2>
<Link to="/home/client" className="dashboard-button">
Volver al Inicio
</Link>
</div>
  <div className="ajuste-grid">
    <button
      className={`ajuste-card ${formularioActivo === 'datos' ? 'active' : ''}`}
      onClick={() => manejarSeleccion('datos')}
    >
      Datos Personales
    </button>
    <button
      className={`ajuste-card ${formularioActivo === 'contacto' ? 'active' : ''}`}
      onClick={() => manejarSeleccion('contacto')}
    >
      Información de Contacto
    </button>
    <button
      className={`ajuste-card ${formularioActivo === 'bancaria' ? 'active' : ''}`}
      onClick={() => manejarSeleccion('bancaria')}
    >
      Información Bancaria
    </button>
    <button
      className={`ajuste-card ${formularioActivo === 'contrasena' ? 'active' : ''}`}
      onClick={() => manejarSeleccion('contrasena')}
    >
      Cambiar Contraseña
    </button>
  </div>

  <div className="formulario-render">
    {formularioActivo && (
      <>
        <button
          className="cerrar-todo-button"
          onClick={() => setFormularioActivo(null)}
        >
          Cerrar Todo
        </button>

        {formularioActivo === 'datos' && <DatosPC />}

      </>
    )}
  </div>
</div>
);
};

export default ClienteAjustes;