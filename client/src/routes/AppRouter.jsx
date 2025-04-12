import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';
import Login from '../pages/Login';
import Reservas from '../pages/Reservations';
import Reportes from '../pages/Reports';
import Dashboard from '../pages/Dashboard';
import GestionReservas from '../pages/GestionReservas';
import GestionUsuarios from '../pages/GestionUsuarios';
import Configuracion from '../pages/Configuracion';
import Registro from '../pages/Register';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Mapa from '../pages/Map';
import Galeria from '../pages/Gallery';
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
        <Route path="/admin/configuracion" element={<Configuracion />} />
        

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
