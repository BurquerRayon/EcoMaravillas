import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';
import Login from '../pages/Login';
import Reservas from '../pages/Reservas';
import Reportes from '../pages/Reportes';
import Dashboard from '../pages/Dashboard';
import GestionReservas from '../pages/GestionReservas';
import GestionUsuarios from '../pages/GestionUsuarios';
import Configuracion from '../pages/Configuracion';
import Registro from '../pages/Registro';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';

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



        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
