import React from 'react';
import FormularioReserva from './FormularioReserva';
import ListaReservas from './ListaReservas';
import '../../../styles/ReservasCliente.css';

const ReservasCliente = () => {
  return (
    <div className="reservas-cliente-container" style={{ padding: '2rem' }}>
      <h1>Mis Reservas</h1>
      <FormularioReserva />
      <hr />
      <ListaReservas />
    </div>
  );
};

export default ReservasCliente;
