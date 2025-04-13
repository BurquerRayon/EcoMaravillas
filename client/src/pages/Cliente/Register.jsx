import React from 'react';
import '../../styles/Register.css';

const Registro = () => {
  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2>Crear Cuenta</h2>
        <form className="registro-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input type="password" id="confirm-password" required />
          </div>

          <button type="submit" className="btn-registrar">Registrarse</button>
        </form>
        <p className="mensaje-login">¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
      </div>
    </div>
  );
};

export default Registro;

