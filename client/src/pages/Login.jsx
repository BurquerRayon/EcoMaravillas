import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // para redireccionar
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  // Lista simulada de usuarios válidos
  const users = [
    { username: 'c1', password: '1234', role: 'cliente' },
    { username: 'e1', password: '5678', role: 'empleado' },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userFound = users.find(
      user => user.username === formData.username && user.password === formData.password
    );

    if (!formData.username || !formData.password) {
      setLoginMessage('Por favor, completa los campos con los datos correspondientes.');
      return;
    }

    if (userFound) {
      // Guardar en localStorage y redirigir a /
      localStorage.setItem('user', JSON.stringify(userFound));
      setLoginMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        navigate('/'); // Redirige al componente Home
      }, 1000);
    } else {
      setLoginMessage('Credenciales incorrectas. Intenta nuevamente.');
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