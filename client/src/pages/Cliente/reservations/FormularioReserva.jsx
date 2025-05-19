import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FormularioReserva = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [form, setForm] = useState({
    id_atraccion: '',
    fecha: '',
    hora: '',
    cantidad: 1
  });

  const [mensaje, setMensaje] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAtracciones = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/atracciones');
        setAtracciones(res.data);
      } catch (err) {
        console.error('Error al cargar atracciones', err);
      }
    };

    fetchAtracciones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación visual directa del lunes
    if (name === 'fecha') {
  const [ano, mes, dia] = value.split('-');
  const fechaUTC = new Date(Date.UTC(ano, mes - 1, dia));
  const day = fechaUTC.getUTCDay(); // 1 = lunes

  if (day === 1) {
    setMensaje('❌ El parque está cerrado los lunes.');
    return;
  }
}


    setForm({ ...form, [name]: value });
    setMensaje(''); // Limpiar mensaje al corregir campos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar horario (09:00 - 17:00)
    const [h, m] = form.hora.split(':');
    const hora = parseInt(h, 10);
    const minutos = parseInt(m, 10);

    if (
      hora < 9 ||
      hora > 17 ||
      (hora === 17 && minutos > 0)
    ) {
      setMensaje('❌ La hora debe estar entre 09:00 y 17:00.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/reservas', {
        ...form,
        id_usuario: user.id
      });

      setMensaje('✅ Reserva realizada con éxito');
      setForm({ id_atraccion: '', fecha: '', hora: '', cantidad: 1 });
    } catch (err) {
      console.error(err);
      setMensaje(err.response?.data?.message || '❌ Error al hacer la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hacer una nueva reserva</h3>

      <label>Atracción:</label>
      <select name="id_atraccion" value={form.id_atraccion} onChange={handleChange} required>
        <option value="">-- Selecciona una atracción --</option>
        {atracciones.map((a) => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>

      <label>Fecha:</label>
      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
        min={new Date().toISOString().split('T')[0]}
        required
      />

      <label>Hora:</label>
      <input
        type="time"
        name="hora"
        value={form.hora}
        onChange={handleChange}
        min="09:00"
        max="17:00"
        required
      />

      <label>Cantidad:</label>
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        min="1"
        onChange={handleChange}
        required
      />

      <button type="submit">Reservar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};

export default FormularioReserva;
