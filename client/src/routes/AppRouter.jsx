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
import GestionUsuarios from '../pages/Admin/GestionUsuarios';
import Config from '../pages/Admin/Config';
import Registro from '../pages/Cliente/Register';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import Mapa from '../pages/Cliente/Map';
import Galeria from '../pages/Cliente/Gallery';
import Nosotros from '../pages/About';
import ReservasCliente from '../pages/Cliente/ReservasCliente';
import AdminHome from '../pages/Home/AdminHome';
import AtraccionesConfig  from '../pages/Admin/Config/Atracciones';
import MonedasConfig  from '../pages/Admin/Config/Monedas';
import NacionalidadesConfig  from '../pages/Admin/Config/Nacionalidades';
import PermisosConfig  from '../pages/Admin/Config/Permisos';
import RolesConfig  from '../pages/Admin/Config/Roles';
import ReportesConfig  from '../pages/Admin/Config/TiposDeReportes';
import ConfigHoras  from '../pages/Admin/Config/HorarioReservasConfig';
import GestionReservasAdmin  from '../pages/Admin/AdminReservas';

const AppRouter = () => {
  return (
    <AuthProvider> {/* Envuelve todo con AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas de Empleados */}
        <Route path="/admin/reservas" element={<GestionReservas />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/reportes" element={<Reportes />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/config" element={<Config />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/ajustes/roles" element={<RolesConfig />} />
        <Route path="/admin/ajustes/permisos" element={<PermisosConfig />} />
        <Route path="/admin/ajustes/atracciones" element={<AtraccionesConfig />} />
        <Route path="/admin/ajustes/monedas" element={<MonedasConfig />} />
        <Route path="/admin/ajustes/reportes" element={<ReportesConfig />} />
        <Route path="/admin/ajustes/nacionalidades" element={<NacionalidadesConfig />} />
        <Route path="/admin/ajustes/configuracionhoras" element={<ConfigHoras />} />
        <Route path="/admin/ajustes/Reservas" element={<GestionReservasAdmin />} />

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
