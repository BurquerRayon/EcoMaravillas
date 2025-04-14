import React, { useState } from 'react';
import '../../styles/GestionReservasEmpleado.css'; // Asegúrate de crear y vincular este CSS

const reservasIniciales = [
  {
    id: 1,
    cliente: 'Carlos Pérez',
    tour: 'Tour Completo',
    fecha: '2025-04-20',
    hora: '10:00 AM',
    estado: 'Pendiente',
  },
  {
    id: 2,
    cliente: 'Ana Torres',
    tour: 'Tour Básico',
    fecha: '2025-04-21',
    hora: '2:00 PM',
    estado: 'Confirmada',
  },
  {
    id: 3,
    cliente: 'Luis Rodríguez',
    tour: 'Tour Premium',
    fecha: '2025-04-22',
    hora: '9:00 AM',
    estado: 'Cancelada',
  },
];

const GestionReservasEmpleado = () => {
  const [reservas, setReservas] = useState(reservasIniciales);

  const actualizarEstado = (id, nuevoEstado) => {
    const actualizadas = reservas.map((reserva) =>
      reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
    );
    setReservas(actualizadas);
  };

  return (
    <div className="gestor-reservas">
      <h1>Gestión de Reservas</h1>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tour</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.cliente}</td>
              <td>{reserva.tour}</td>
              <td>{reserva.fecha}</td>
              <td>{reserva.hora}</td>
              <td>
                <span className={`estado ${reserva.estado.toLowerCase()}`}>
                  {reserva.estado}
                </span>
              </td>
              <td>
                <select
                  value={reserva.estado}
                  onChange={(e) => actualizarEstado(reserva.id, e.target.value)}
                >
                  <option value="Pendiente">Posponer</option>
                  <option value="Confirmada">Confirmar</option>
                  <option value="Cancelada">Cancelar</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionReservasEmpleado;
