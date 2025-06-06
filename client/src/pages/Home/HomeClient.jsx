import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaMapMarkedAlt, FaUserEdit, FaImages, FaLeaf } from 'react-icons/fa';
import '../../styles/HomeClient.css';

const HomeClient = () => {
const { user } = useAuth();

return (
<div className="cliente-home-container">
<header className="cliente-home-header">
<h1>Bienvenido, {user?.nombre || 'Turista'}</h1>
<p>Explora, reserva y disfruta de la experiencia EcoMaravillas.</p>
</header>
  <section className="cliente-home-grid">
    <div className="cliente-card" onClick={() => window.location.href = '/reservas'}>
      <FaCalendarAlt className="icono-card" />
      <h3>Reservar atracción</h3>
      <p>Agenda tu próxima visita a nuestras rutas ecológicas.</p>
    </div>

    <div className="cliente-card" onClick={() => window.location.href = '/map'}>
      <FaMapMarkedAlt className="icono-card" />
      <h3>Ver Mapa</h3>
      <p>Descubre hábitats y atracciones disponibles.</p>
    </div>

    <div className="cliente-card" onClick={() => window.location.href = '/gallery'}>
      <FaImages className="icono-card" />
      <h3>Galería de Especies</h3>
      <p>Observa la fauna y flora destacada de la reserva.</p>
    </div>

    <div className="cliente-card" onClick={() => window.location.href = '/perfil'}>
      <FaUserEdit className="icono-card" />
      <h3>Editar Perfil</h3>
      <p>Actualiza tu información personal y preferencias.</p>
    </div>
  </section>

  <section className="cliente-info-extra">
    <h2>🌿 ¿Por qué EcoMaravillas?</h2>
    <ul>
      <li><strong>Compromiso ambiental:</strong> Todas nuestras actividades están certificadas ecológicamente.</li>
      <li><strong>Seguridad y comodidad:</strong> Reservas fáciles desde casa.</li>
      <li><strong>Educación ambiental:</strong> Participa en nuestras campañas de concientización.</li>
    </ul>
  </section>

  <footer className="cliente-footer">
    <p>&copy; {new Date().getFullYear()} EcoMaravillas. Todos los derechos reservados.</p>
  </footer>
</div>
);
};

export default HomeClient;