import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // detecta cambios de ruta
  const menuRef = useRef(null); // referencia al dropdown
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Cierra menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cierra menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Cierra menú al cambiar de cuenta
  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  return (
    <nav className="navbar">
      <h4 className="logo">EcoMaravillas</h4>

      <ul className="nav-links">
        <li><Link to="/" className="nav-button">Inicio</Link></li>

        {!user && (
          <li className="dropdown" ref={menuRef}>
            <button className="nav-button dropbtn" onClick={toggleMenu}>☰</button>
            {menuOpen && (
              <ul className="dropdown-content">
                <li><Link to="/about">Sobre Nosotros</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/registro">Registro</Link></li>
              </ul>
            )}
          </li>
        )}

        {user && (
          <li className="dropdown" ref={menuRef}>
            <button className="nav-button dropbtn" onClick={toggleMenu}>
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
      </ul>
    </nav>
  );
};

export default Navbar;
