import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Register.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        nombre: formData.nombre,
        correo: formData.email,
        contrasena: formData.password,
        rol: 'cliente' // Por defecto cliente
      });

      setMensaje(res.data.message);
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2>Crear Cuenta</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-registrar">Registrarse</button>
        </form>
        <p className="mensaje-login">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
        <p className="mensaje-error">{mensaje}</p>
      </div>
    </div>
  );
};

export default Registro;
