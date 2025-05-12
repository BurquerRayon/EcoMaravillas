import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Importar el hook de autenticación
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtener la función login del contexto

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setLoginMessage('Por favor, completa los campos con los datos correspondientes.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        correo: formData.username,
        contrasena: formData.password
      });

      // Cambio principal: Usar la función login del contexto en lugar de localStorage directamente
      login(res.data.user); // Esto actualizará el estado global automáticamente
      setLoginMessage('¡Inicio de sesión exitoso! Redirigiendo...');

      // Redirección basada en el rol
      const rol = res.data.user.rol;

      if (rol === 'cliente') {
        navigate('/home/client');
      } else if (rol === 'empleado') {
        navigate('/home/employee');
      } else {
        navigate('/');
      }

    } catch (err) {
      setLoginMessage(err.response?.data?.message || 'Error en la autenticación.');
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
              <label htmlFor="username">Correo</label>
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