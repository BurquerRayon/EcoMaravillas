import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; 
import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';
import Login from '../pages/Login';
import Reportes from '../pages/Empleados/Reports';
import Dashboard from '../pages/Admin/Dashboard';
import GestionReservas from '../pages/Empleados/GestionReservas';
import GestionUsuarios from '../pages/Empleados/GestionUsuarios';
import Config from '../pages/Admin/Config';
import Registro from '../pages/Cliente/Register';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Mapa from '../pages/Cliente/Map';
import Galeria from '../pages/Cliente/Gallery';
import Nosotros from '../pages/About';
import ReservasCliente from '../pages/Cliente/reservations/ReservasCliente';
import AdminHome from '../pages/Home/AdminHome';

const AppRouter = () => {
  return (
    <AuthProvider> {/* Envuelve todo con AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reportes" element={<Reportes />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/reservas" element={<GestionReservas />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/admin/config" element={<Config />} />
        

        {/* Rutas de Paginas Home */}
        <Route path="/home/client" element={<HomeClient />} />
        <Route path="/home/employee" element={<HomeEmployee />} />
        <Route path="/home/admin" element={<AdminHome />} />

        {/* Rutas de Paginas de Reportes */}
        <Route path="/about" element={<Nosotros/>} />

        {/* Rutas de Paginas de Reservas */}
        <Route path="/reservas" element={<ReservasCliente />} />
        <Route path="/map" element={<Mapa />} />
        <Route path="/gallery" element={<Galeria />} />

        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
