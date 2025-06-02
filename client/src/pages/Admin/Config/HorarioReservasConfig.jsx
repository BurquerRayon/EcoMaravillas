// HorarioReservasConfig.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/HorarioReservasConfig.css';

const HorarioReservasConfig = () => {
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('17:00');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/config/horario-reservas');
        setHoraInicio(res.data.hora_inicio);
        setHoraFin(res.data.hora_fin);
      } catch (err) {
        console.error('Error al cargar horario:', err);
      }
    };
    cargarHorario();
  }, []);

  const generarHoras = () => {
    const opciones = [];
    const [hInicio, mInicio] = [0, 0];
    const [hFin, mFin] = [23, 59];

    let actual = new Date();
    actual.setHours(hInicio, mInicio, 0, 0);

    const fin = new Date();
    fin.setHours(hFin, mFin, 0, 0);

    while (actual <= fin) {
      const hora = actual.toTimeString().slice(0, 5);
      opciones.push(hora);
      actual.setMinutes(actual.getMinutes() + 10);
    }
    return opciones;
  };

  const todasLasHoras = generarHoras();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/api/config/horario-reservas', {
        hora_inicio: horaInicio,
        hora_fin: horaFin
      });
      setMensaje('✅ Horario actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar horario:', err);
      setMensaje('❌ Error al guardar el horario');
    }
  };

  return (
    <div className="horario-container">
      <h2>Configuración de Horario de Reservas</h2>
      <form className="horario-form" onSubmit={handleSubmit}>
        <label>Hora de inicio:</label>
        <select value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
          {todasLasHoras.map(hora => (
            <option key={hora} value={hora}>{hora}</option>
          ))}
        </select>

        <label>Hora de fin:</label>
        <select value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
          {todasLasHoras.map(hora => (
            <option key={hora} value={hora}>{hora}</option>
          ))}
        </select>

        <button type="submit">Guardar Horario</button>
        {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
      </form>
    </div>
  );
};

export default HorarioReservasConfig;
