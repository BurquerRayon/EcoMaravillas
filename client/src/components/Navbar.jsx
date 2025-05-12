import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext'; // Añadir

const Navbar = () => {
  const { user, logout } = useAuth(); // Cambiar esto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">EcoMaravillas</h2>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>

        {user?.rol === 'cliente' && (
          <>
            <li><Link to="/reservas">Mis Reservas</Link></li>
            <li><Link to="/gallery">Galería</Link></li>
            <li><Link to="/map">Mapa</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        )}

        {user?.rol === 'empleado' && (
          <>
            <li><Link to="/admin/dashboard">Panel De Control</Link></li>
            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        )}

        {!user && (
          <>
            <li><Link to="/gallery">Galería</Link></li>
            <li><Link to="/map">Mapa</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/registro">Registro</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;