import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // 👈 importa el CSS externo


const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar">
      <h2 className="logo">EcoMaravillas</h2>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>

        {/* Links comunes para todos los usuarios logueados */}
        {user && user.role === 'cliente' && (
          <>
            <li><Link to="/reservas">Mis Reservas</Link></li>
            <li><Link to="/gallery">Galería</Link></li>
            <li><Link to="/map">Mapa</Link></li>
            <li><button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}>Cerrar sesión</button></li>
          </>
        )}

        {user && user.role === 'empleado' && (
          <>
            <li><Link to="/Reportes">Reportes</Link></li>
            <li><Link to="/reservas">Gestión de Reservas</Link></li>
            <li><button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}>Cerrar sesión</button></li>
          </>
        )}

        {/* Usuario sin iniciar sesión */}
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
