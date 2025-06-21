import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ClientePago = () => {
  const { id_reserva } = useParams();
  const [reserva, setReserva] = useState(null);
  const [metodos, setMetodos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [pago, setPago] = useState({ id_metodo_pago: '', id_moneda: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`/api/reservas/${id_reserva}`);
        setReserva(res.data);

        const metodos = await axios.get('/api/metodos-pago');
        setMetodos(metodos.data);

        const monedas = await axios.get('/api/monedas');
        setMonedas(monedas.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    cargar();
  }, [id_reserva]);

  const enviarPago = async () => {
    if (!pago.id_metodo_pago || !pago.id_moneda) {
      return alert('Selecciona método y moneda');
    }

    try {
      await axios.post('/api/pagos/registrar', {
        id_reserva,
        id_metodo_pago: pago.id_metodo_pago,
        id_moneda: pago.id_moneda,
        monto: reserva.total_pago_estimado
      });

      alert('✅ Pago simulado exitoso');
      navigate('/cliente/reservas');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar el pago');
    }
  };

  if (!reserva) return <p>Cargando...</p>;

  return (
    <div className="pago-container">
      <h2>Pago de Reserva #{id_reserva}</h2>
      <p>Total a pagar: <strong>${reserva.total_pago_estimado}</strong></p>

      <label>Método de pago:</label>
      <select onChange={(e) => setPago({ ...pago, id_metodo_pago: e.target.value })}>
        <option value="">Selecciona</option>
        {metodos.map(m => (
          <option key={m.id_metodo_pago} value={m.id_metodo_pago}>{m.nombre}</option>
        ))}
      </select>

      <label>Moneda:</label>
      <select onChange={(e) => setPago({ ...pago, id_moneda: e.target.value })}>
        <option value="">Selecciona</option>
        {monedas.map(m => (
          <option key={m.id_moneda} value={m.id_moneda}>{m.nombre}</option>
        ))}
      </select>

      <button onClick={enviarPago}>💳 Pagar</button>
    </div>
  );
};

export default ClientePago;
