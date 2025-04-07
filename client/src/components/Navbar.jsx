import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // 👈 importa el CSS externo

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">EcoMaravillas</h2>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
        <li><Link to="/reportes">Reportes</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
