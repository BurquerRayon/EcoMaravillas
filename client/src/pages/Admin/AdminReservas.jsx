import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminReservas.css';

const AdminReservas = () => {
const [reservas, setReservas] = useState([]);
const [filtroEstado, setFiltroEstado] = useState('');
const [filtroFecha, setFiltroFecha] = useState('');

useEffect(() => {
cargarReservas();
}, []);

const cargarReservas = async () => {
try {
const res = await axios.get('http://localhost:3001/api/admin/reservas');
setReservas(res.data);
} catch (error) {
console.error('Error al cargar reservas:', error);
}
};

const formatearHora = (horaStr) => {
if (!horaStr) return '';
const [hour, minute] = horaStr.split(':');
const h = parseInt(hour, 10);
const m = minute.padStart(2, '0');
const ampm = h >= 12 ? 'PM' : 'AM';
const hour12 = h % 12 || 12;
return `${hour12}:${m} ${ampm}`;
};

const reservasFiltradas = reservas.filter((r) => {
const coincideEstado = !filtroEstado || r.estado?.toLowerCase() === filtroEstado.toLowerCase();
const coincideFecha = !filtroFecha || r.fecha?.startsWith(filtroFecha);
return coincideEstado && coincideFecha;
});

return (
<div className="admin-reservas-container">
<div className="reservas-header">
<h2>Gestión de Reservas</h2>
</div>
  <div className="filtros-reservas-admin">
    <input
      type="date"
      value={filtroFecha}
      onChange={(e) => setFiltroFecha(e.target.value)}
    />
    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
      <option value="">Todos los estados</option>
      <option value="pendiente">Pendiente</option>
      <option value="confirmado">Confirmado</option>
      <option value="cancelado">Cancelado</option>
    </select>
  </div>

  <table className="tabla-reservas-admin">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Atracción</th>
        <th>Turista</th>
        <th>Cantidad</th>
        <th>Subtotal</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {reservasFiltradas.length === 0 ? (
        <tr>
          <td colSpan="7">No hay reservas registradas.</td>
        </tr>
      ) : (
        reservasFiltradas.map((r, idx) => (
          <tr key={idx}>
            <td>{r.fecha?.split('T')[0]}</td>
            <td>{formatearHora(r.hora)}</td>
            <td>{r.nombre_atraccion}</td>
            <td>{r.nombre_turista}</td>
            <td>{r.cantidad}</td>
            <td>${r.subtotal?.toFixed(2)}</td>
            <td>{r.estado}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
);
};

export default AdminReservas;