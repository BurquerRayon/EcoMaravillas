import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ReservasCliente.css';

const reservasMock = [
  {
    id: 101,
    tour: 'Tour Ecológico',
    fecha: '2025-04-18',
    hora: '11:00 AM',
    estado: 'Confirmada',
  },
  {
    id: 102,
    tour: 'Tour Aventura',
    fecha: '2025-04-22',
    hora: '2:00 PM',
    estado: 'Pendiente',
  },
  {
    id: 103,
    tour: 'Tour Nocturno',
    fecha: '2025-04-25',
    hora: '7:30 PM',
    estado: 'Cancelada',
  },
];

const GestionReservas = () => {

    const navigate = useNavigate();
  
    const irACrearReserva = () => {
      navigate('/reservas');
    };
  
    return (
      <div className="reservas-cliente">
        <div className="header">
          <h2>Mis Reservas</h2>
          <button onClick={irACrearReserva}>+ Crear Nueva Reserva</button>
        </div>
  
        <div className="tabla-reservas">
          <table>
            <thead>
              <tr>
                <th>Tour</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasMock.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.tour}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora}</td>
                  <td>
                    <span className={`estado ${reserva.estado.toLowerCase()}`}>
                      {reserva.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

export default GestionReservas;
