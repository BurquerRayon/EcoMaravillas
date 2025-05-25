import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [mensaje, setMensaje] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correo || !formData.contrasena) {
      setMensaje('Completa todos los campos');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', formData);

      login(res.data.user);

      const rol = res.data.user.rol;
      if (rol === 'cliente') navigate('/home/client');
      else if (rol === 'empleado') navigate('/home/employee');
      else if (rol === 'admin') navigate('/home/admin');
      else navigate('/');

    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error en el inicio de sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">Ingresar</button>
        </form>

        {mensaje && <p id="login-message">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Login;
