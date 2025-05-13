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

  // Obtener atracciones al cargar
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
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_atraccion) {
      setMensaje('Selecciona una atracción válida.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/reservas', {
        ...form,
        id_usuario: user.id
      });

      setMensaje('Reserva realizada con éxito');
      setForm({ id_atraccion: '', fecha: '', hora: '', cantidad: 1 }); // Reset
    } catch (err) {
      console.error(err);
      setMensaje('Error al hacer la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Hacer una nueva reserva</h3>

      <label>Atracción:</label>
      <select name="id_atraccion" value={form.id_atraccion} onChange={handleChange} required>
        <option value="">-- Selecciona una atracción --</option>
        {atracciones.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre} - {a.duracion}
          </option>
        ))}
      </select>

      <label>Fecha:</label>
      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

      <label>Hora:</label>
      <input type="time" name="hora" value={form.hora} onChange={handleChange} required />

      <label>Cantidad:</label>
      <input type="number" name="cantidad" value={form.cantidad} min="1" onChange={handleChange} required />

      <button type="submit">Reservar</button>
      <p>{mensaje}</p>
    </form>
  );
};

export default FormularioReserva;
