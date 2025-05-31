import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ReservaCliente.css';

const ReservaCliente = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [detalles, setDetalles] = useState([
    { id_atraccion: '', cantidad: 1, fecha: '', hora: '', tarifa_unitaria: 0, subtotal: 0 }
  ]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const [mostrarFiltros, setMostrarFiltros] = useState(false); // NUEVO

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:3001/api/atracciones')
      .then(res => setAtracciones(res.data))
      .catch(err => console.error('Error al cargar atracciones:', err));
  }, []);

  useEffect(() => {
    const nuevoTotal = detalles.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  }, [detalles]);

  const handleDetalleChange = (index, field, value) => {
    const nuevaLista = [...detalles];
    nuevaLista[index][field] = value;

    if (field === 'id_atraccion') {
      const atraccion = atracciones.find(a => a.id_atraccion === parseInt(value));
      if (atraccion) nuevaLista[index].tarifa_unitaria = atraccion.precio;
    }

    const cantidad = parseInt(nuevaLista[index].cantidad) || 0;
    const tarifa = parseFloat(nuevaLista[index].tarifa_unitaria) || 0;
    nuevaLista[index].subtotal = cantidad * tarifa;

    setDetalles(nuevaLista);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { id_atraccion: '', cantidad: 1, fecha: '', hora: '', tarifa_unitaria: 0, subtotal: 0 }]);
  };

  const eliminarDetalle = (index) => {
    const nuevaLista = detalles.filter((_, i) => i !== index);
    setDetalles(nuevaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_turista = user?.id_turista;

    try {
      await axios.post('http://localhost:3001/api/reservas', {
        id_turista,
        detalles
      });

      setMensaje('✅ Reserva creada correctamente');
      setDetalles([{ id_atraccion: '', cantidad: 1, fecha: '', hora: '', tarifa_unitaria: 0, subtotal: 0 }]);
      cargarHistorial();
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      setMensaje('❌ Error al guardar la reserva');
    }
  };

  const cargarHistorial = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/reservas/turista/${user.id_turista}`);
      setHistorial(res.data);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
    }
  };

  useEffect(() => {
    if (user?.id_turista) cargarHistorial();
  }, [user]);

  const formatearHora = (horaStr) => {
    if (!horaStr) return '';
    const [hour, minute] = horaStr.split(':');
    const h = parseInt(hour, 10);
    const m = minute.padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const reservasFiltradas = historial.filter((reserva) => {
    const coincideFecha = !filtroFecha || reserva.fecha?.startsWith(filtroFecha);
    const coincideNombre = !filtroNombre || reserva.nombre_atraccion?.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideEstado = !filtroEstado || reserva.estado?.toLowerCase() === filtroEstado;
    return coincideFecha && coincideNombre && coincideEstado;
  });

  return (
    <div className="dashboard-container">

      <section className="panel-botones">
        <button
          type="button"
          className="btn-toggle-form"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Crear Nueva Reserva'}
        </button>

        <button
          type="button"
          className="btn-toggle-form"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          {mostrarFiltros ? '➖ Ocultar Búsqueda' : '🔍 Buscar Reservas'}
        </button>
      </section>

      {mostrarFormulario && (
        <section className="reserva-form">
          <h2>Crear Nueva Reserva</h2>
          <form onSubmit={handleSubmit}>
            {detalles.map((detalle, index) => (
              <div key={index} className="reserva-linea">
                <select
                  value={detalle.id_atraccion}
                  onChange={(e) => handleDetalleChange(index, 'id_atraccion', e.target.value)}
                  required
                >
                  <option value="">Selecciona una atracción</option>
                  {atracciones.map((a) => (
                    <option key={a.id_atraccion} value={a.id_atraccion}>
                      {a.nombre} - ${a.precio}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                  required
                />

                <input
                  type="date"
                  value={detalle.fecha}
                  onChange={(e) => handleDetalleChange(index, 'fecha', e.target.value)}
                  required
                />

                <input
                  type="time"
                  value={detalle.hora}
                  onChange={(e) => handleDetalleChange(index, 'hora', e.target.value)}
                  required
                />

                <span>Subtotal: ${detalle.subtotal.toFixed(2)}</span>
                {detalles.length > 1 && (
                  <button type="button" onClick={() => eliminarDetalle(index)}>Eliminar</button>
                )}
              </div>
            ))}

            <button type="button" onClick={agregarDetalle}>+ Agregar atracción</button>
            <h3>Total estimado: ${total.toFixed(2)}</h3>
            <button type="submit">Reservar</button>
          </form>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </section>
      )}

        {mostrarFiltros && (
          <section className="filtros-reserva">
            <h3>Buscar Reservas</h3>
            <div className="filtros-grid">
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nombre de atracción"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </section>
        )}

      <section className="historial">
        <h2>Mis Reservas</h2>
        <table className="tabla-reservas">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Atracción</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr><td colSpan="6">No hay reservas registradas.</td></tr>
            ) : (
              reservasFiltradas.map((reserva, idx) => (
                <tr key={idx}>
                  <td>{reserva.fecha?.split('T')[0]}</td>
                  <td>{formatearHora(reserva.hora)}</td>
                  <td>{reserva.nombre_atraccion}</td>
                  <td>{reserva.cantidad}</td>
                  <td>${reserva.subtotal?.toFixed(2)}</td>
                  <td>{reserva.estado}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ReservaCliente;
