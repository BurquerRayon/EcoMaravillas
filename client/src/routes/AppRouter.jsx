import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Nosotros from '../pages/About';

import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';

import Galeria from '../pages/Cliente/Gallery';
import ConfigC from '../pages/Cliente/ConfigC';
import GestionReservas from '../pages/Cliente/GestionReservas';
import Reservas from '../pages/Cliente/Reservations';
import Registro from '../pages/Cliente/Register';
import Mapa from '../pages/Cliente/Map';
import Perfil from '../pages/Cliente/Profile';

import Reportes from '../pages/Empleados/Reports';
import Dashboard from '../pages/Empleados/Dashboard';
import GestorReservas from '../pages/Empleados/GestorReservas';
import GestionUsuarios from '../pages/Empleados/GestionUsuarios';
import Config from '../pages/Empleados/ConfigE';
import CrearUsuario from '../pages/Empleados/CreateUser';
import CrearReporte from '../pages/Empleados/CreateReports';
import DetalleReporte from '../pages/Empleados/ReportDetail';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rutas de Paginas Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home/client" element={<HomeClient />} />
        <Route path="/home/employee" element={<HomeEmployee />} />

        {/* Rutas de Pagina Generales */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Nosotros/>} />
        <Route path="*" element={<NotFound />} />

        {/* Rutas de Pagina del cliente */}
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/mis-reservas" element={<GestionReservas />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/map" element={<Mapa />} />
        <Route path="/gallery" element={<Galeria />} />
        <Route path="/config" element={<ConfigC />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Rutas de Pagina para los empleado - admins */}
        <Route path="/admin/reportes" element={<Reportes />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/admin/config" element={<Config />} />
        <Route path="/admin/gestor-reservas" element={<GestorReservas />} />
        <Route path="/admin/crear-usuario" element={<CrearUsuario />} />
        <Route path="/admin/crear-reporte" element={<CrearReporte />} />
        <Route path="/admin/reporte/:id" element={<DetalleReporte />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
