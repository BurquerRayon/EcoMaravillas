import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import Footer from '../components/Footer';
import '../styles/Footer.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
    correo: '', 
    contrasena: '' 
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: value 
    }));
    // Limpiar mensajes cuando el usuario escribe
    if (mensaje) setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    // Validación básica
    if (!formData.correo || !formData.contrasena) {
      setMensaje('⚠️ Completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', formData);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Guardar usuario en contexto y localStorage
        login(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirección basada en el rol
        switch(user.rol?.toLowerCase?.()) {
          case 'admin':
            console.log('Redirigiendo a admin');
            navigate('/home/admin');
            break;
          case 'empleado':
            console.log('Redirigiendo a empleado');
            navigate('/home/employee');
            break;
          case 'cliente':
            console.log('Redirigiendo a cliente');
            navigate('/home/client');
            break;
          default:
            console.warn('Rol no reconocido:', user.rol);
            navigate('/');
        }

      } else {
        setMensaje(`❌ ${response.data.message}`);
      }
    } catch (err) {
      console.error('Error en login:', err);
      
      // Manejo de errores específicos
      if (err.response) {
        const { data } = err.response;
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          setMensaje('❌ Correo no verificado. Revisa tu bandeja de entrada.');
        } else {
          setMensaje(`❌ ${data.message || 'Error en el inicio de sesión'}`);
        }
      } else {
        setMensaje('❌ Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-page-wrapper">
    <main className="login-content">
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>

            <div className="login-links">
              <button
                type="button"
                className="login-link-btn"
                onClick={() => navigate('/recuperar')}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <button
                type="button"
                className="login-link-btn"
                onClick={() => navigate('/registro')}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </form>

          {mensaje && (
            <p className={`login-message ${mensaje.includes('❌') ? 'error' : 'info'}`}>
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default Login;