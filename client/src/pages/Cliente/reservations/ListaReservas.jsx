import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/ListaReservas.css';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({ fecha: '', hora: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  // Función para formatear la hora
  const formatHora = (horaString) => {
    if (!horaString) return '--:--';
    
    // Si ya está en formato HH:mm (desde la API)
    if (/^\d{2}:\d{2}$/.test(horaString)) {
    return horaString;
  }

    
    // Si viene como fecha ISO (ej. 1970-01-01T10:40:00.000Z)
    if (horaString.includes('T')) {
      try {
        const date = new Date(horaString);
        return date.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Cambia a true si quieres formato 12h (3:45 PM)
        });
      } catch (e) {
        return horaString;
      }
    }
    
    return horaString;
  };

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
        // Formateamos las horas antes de guardar en el estado
        const reservasFormateadas = res.data.map(reserva => ({
          ...reserva,
          hora: formatHora(reserva.hora)
        }));
        setReservas(reservasFormateadas);
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
      hora: formatHora(reserva.hora) // Formateamos la hora al editar
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/reservas/${id}`, formEdit);
      setEditandoId(null);
      // Recargar reservas
      const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
      const reservasFormateadas = res.data.map(reserva => ({
        ...reserva,
        hora: formatHora(reserva.hora)
      }));
      setReservas(reservasFormateadas);
    } catch (err) {
      console.error('Error al actualizar reserva', err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/reservas/${id}`);
      const res = await axios.get(`http://localhost:3001/api/reservas/${user.id}`);
      const reservasFormateadas = res.data.map(reserva => ({
        ...reserva,
        hora: formatHora(reserva.hora)
      }));
      setReservas(reservasFormateadas);
    } catch (err) {
      console.error('Error al eliminar reserva', err);
    }
  };

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  return (
    <div className="lista-reservas">
      <h3>Historial de Reservas</h3>
      <ul className="reservas-lista">
        {reservas.map((r) => (
          <li key={r.id} className="reserva-item">
            <p><strong>Atracción:</strong> {r.atraccion}</p>
            <p><strong>Estado:</strong> {r.estado}</p>

            <p><strong>Fecha:</strong>{' '}
              {editandoId === r.id ? (
                <input type="date" name="fecha" value={formEdit.fecha} onChange={handleChange} />
              ) : (
                r.fecha?.split('T')[0]
              )}
            </p>

            <p><strong>Hora:</strong>{' '}
              {editandoId === r.id ? (
                <input 
                  type="time" 
                  name="hora" 
                  value={formEdit.hora} 
                  onChange={handleChange} 
                />
              ) : (
                formatHora(r.hora) // Aplicamos formatHora al mostrar
              )}
            </p>

            <p><strong>Cantidad:</strong> {r.cantidad}</p>

            <div className="reserva-botones">
              {editandoId === r.id ? (
                <>
                  <button className="guardar-btn" onClick={() => handleUpdate(r.id)}>Guardar</button>
                  <button className="cancelar-btn" onClick={() => setEditandoId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  {r.estado !== 'aprobado' && (
                    <button className="editar-btn" onClick={() => handleEditar(r)}>Editar</button>
                  )}
                  {r.estado !== 'aprobado' && (
                    <button className="eliminar-btn" onClick={() => handleEliminar(r.id)}>Eliminar</button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaReservas;