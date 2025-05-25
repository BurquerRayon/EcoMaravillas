import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
      <nav className="navbar">
      <ul className="nav-links">
          {/* Menú o enlaces a la izquierda */}

        <li><Link to="/">Inicio</Link></li>

        {user && (
          <li className="dropdown">
            <button className="dropbtn" onClick={toggleMenu}>
              {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)} ▾
            </button>

            {menuOpen && (
              <ul className="dropdown-content">
                {user.rol === 'cliente' && (
                  <>
                    <li><Link to="/reservas">Mis Reservas</Link></li>
                    <li><Link to="/gallery">Galería</Link></li>
                    <li><Link to="/map">Mapa</Link></li>
                    <li><Link to="/about">Sobre Nosotros</Link></li>
                    <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                  </>
                )}

                {user.rol === 'empleado' && (
                  <>
                    <li><Link to="/admin/dashboard">Panel de Control</Link></li>
                    <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                  </>
                )}

                {user.rol === 'admin' && (
                  <>
                    <li><Link to="/admin/config">Configuraciones</Link></li>
                    <li><Link to="/admin/dashboard">Panel de Control</Link></li>
                    <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                  </>
                )}
              </ul>
            )}
          </li>
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
    <h2 className="logo">EcoMaravillas</h2>
    </nav>
  );
};

export default Navbar;
