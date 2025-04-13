import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';
import Login from '../pages/Login';
import Reservas from '../pages/Cliente/Reservations';
import Reportes from '../pages/Empleados/Reports';
import Dashboard from '../pages/Empleados/Dashboard';
import GestionReservas from '../pages/Empleados/GestionReservas';
import GestionUsuarios from '../pages/Empleados/GestionUsuarios';
import Config from '../pages/Empleados/Config';
import Registro from '../pages/Cliente/Register';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Mapa from '../pages/Cliente/Map';
import Galeria from '../pages/Cliente/Gallery';
import Nosotros from '../pages/About';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reportes" element={<Reportes />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/reservas" element={<GestionReservas />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/admin/config" element={<Config />} />
        

        {/* Rutas de Paginas Home */}
        <Route path="/home/client" element={<HomeClient />} />
        <Route path="/home/employee" element={<HomeEmployee />} />


        {/* Rutas de Paginas de Reportes */}
        <Route path="/about" element={<Nosotros/>} />

        {/* Rutas de Paginas de Reservas */}
        <Route path="/map" element={<Mapa />} />
        <Route path="/gallery" element={<Galeria />} />

        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
