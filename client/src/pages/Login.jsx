import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

const [loginMessage, setLoginMessage] = useState('');

const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData({ ...formData, [id]: value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Aquí podrías añadir lógica para hacer una petición al backend
  if (!formData.username || !formData.password || !formData.role) {
    setLoginMessage('Por favor, completa todos los campos.');
  } else {
    setLoginMessage('Procesando...');
    // Simulación: Enviar a backend
    console.log(formData);
    // Aquí podrías redirigir o autenticar
  }
};

return (

<div className="home-guest-container">
      <section className="hero">
        <h1>Bienvenido a EcoMaravillas</h1>
          <p>Explora, reserva y descubre la naturaleza.</p>
        </section>
        
  <div className="login-container">
    <div className="login-box">
      <h2>Iniciar Sesión</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn">Ingresar</button>
      </form>
      <p id="login-message">{loginMessage}</p>
    </div>
  </div>
  </div>
);
};

export default Login;