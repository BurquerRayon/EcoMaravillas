import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import '../../../styles/ListaReservas.css';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({ fecha: '', hora: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
        setReservas(res.data);
      } catch (err) {
        console.error('Error al obtener reservas', err);
      }
    };

    cargarReservas();
  }, [user.id]);

  const handleEditar = (reserva) => {
    setEditandoId(reserva.id);
    setFormEdit({
      fecha: reserva.fecha?.split('T')[0] || '',
      hora: reserva.hora || ''
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/reservas/${id}`, formEdit);
      setEditandoId(null);
      const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
      setReservas(res.data);
    } catch (err) {
      console.error('Error al actualizar reserva', err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/reservas/${id}`);
      const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
      setReservas(res.data);
    } catch (err) {
      console.error('Error al eliminar reserva', err);
    }
  };

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  return (
    <div className="reservas-container">
      <h2><FaCalendarAlt /> Mis Reservas</h2>

      {reservas.length === 0 ? (
        <p className="no-reservas">No tienes reservas realizadas.</p>
      ) : (
        <ul className="reservas-list">
          {reservas.map((r) => (
            <li key={r.id} className="reserva-item">
              <div className="reserva-info">
                <h4>{r.atraccion}</h4>
                <p><strong>Estado:</strong> <span className={`estado ${r.estado.toLowerCase()}`}>{r.estado}</span></p>
                <p><strong>Fecha:</strong> {r.fecha?.split('T')[0]}</p>
                <p><strong>Hora:</strong> {r.hora}</p>
                <p><strong>Cantidad:</strong> {r.cantidad}</p>
              </div>

              <div className="reserva-actions">
                {editandoId === r.id ? (
                  <>
                    <input type="date" name="fecha" value={formEdit.fecha} onChange={handleChange} />
                    <input type="time" name="hora" value={formEdit.hora} onChange={handleChange} />
                    <button onClick={() => handleUpdate(r.id)}>Guardar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {r.estado !== 'aprobado' && (
                      <>
                        <button className="edit-btn" onClick={() => handleEditar(r)}><FaEdit /></button>
                        <button className="delete-btn" onClick={() => handleEliminar(r.id)}><FaTrashAlt /></button>
                      </>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaReservas;
