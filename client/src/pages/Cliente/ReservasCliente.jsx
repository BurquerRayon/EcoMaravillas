import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ReservaCliente.css';

const ReservaCliente = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [detalles, setDetalles] = useState([
    { id_atraccion: '', cantidad: 1, fecha: '', hora: '09', minuto: '00', tarifa_unitaria: 0, subtotal: 0 }
  ]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [horas, setHoras] = useState([]);
  const [minutos] = useState(['00', '10', '20', '30', '40', '50']);

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

  const generarHoras = (inicio, fin) => {
    const hInicio = parseInt(inicio.split(':')[0]);
    const hFin = parseInt(fin.split(':')[0]);
    const lista = [];
    for (let h = hInicio; h <= hFin; h++) {
      lista.push(h.toString().padStart(2, '0'));
    }
    return lista;
  };

  useEffect(() => {
    const cargarHorarioValido = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/config/horario-reservas?_ts=' + new Date().getTime());
        const { hora_inicio, hora_fin } = res.data;
        const horasValidas = generarHoras(hora_inicio, hora_fin);
        setHoras(horasValidas);
      } catch (err) {
        console.error('Error al cargar el horario válido:', err);
        // Valores por defecto si falla la carga
        setHoras(['09', '10', '11', '12', '13', '14', '15', '16', '17']);
      }
    };
    cargarHorarioValido();
  }, []);

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
    setDetalles([...detalles, { 
      id_atraccion: '', 
      cantidad: 1, 
      fecha: '', 
      hora: horas[0] || '09', 
      minuto: '00', 
      tarifa_unitaria: 0, 
      subtotal: 0 
    }]);
  };

  const eliminarDetalle = (index) => {
    const nuevaLista = detalles.filter((_, i) => i !== index);
    setDetalles(nuevaLista);
  };

  const validarDetalles = () => {
    return detalles.every(detalle => {
      return (
        detalle.id_atraccion && 
        detalle.cantidad > 0 && 
        detalle.fecha && 
        detalle.hora && 
        detalle.minuto
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_turista = user?.id_turista;

    if (!validarDetalles()) {
      setMensaje('❌ Por favor complete todos los campos correctamente');
      return;
    }

    const detallesParaEnviar = detalles.map(d => {
      // Asegurar que todos los campos tengan valores válidos
      const horaValida = d.hora?.padStart(2, '0') || '09';
      const minutoValido = d.minuto?.padStart(2, '0') || '00';
      
      return {
        id_atraccion: d.id_atraccion,
        cantidad: d.cantidad,
        tarifa_unitaria: d.tarifa_unitaria,
        fecha: d.fecha,
        hora: `${horaValida}:${minutoValido}`,
        subtotal: d.subtotal
      };
    });

    console.log("Enviando reserva con detalles:", detallesParaEnviar);

    try {
      const response = await axios.post('http://localhost:3001/api/reservas', {
        id_turista,
        detalles: detallesParaEnviar
      });

      console.log("Respuesta del servidor:", response.data);

      setMensaje('✅ Reserva creada correctamente');
      setDetalles([{ 
        id_atraccion: '', 
        cantidad: 1, 
        fecha: '', 
        hora: horas[0] || '09', 
        minuto: '00', 
        tarifa_unitaria: 0, 
        subtotal: 0 
      }]);
      cargarHistorial();
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar reserva:', err.response?.data || err.message);
      setMensaje(`❌ Error al guardar la reserva: ${err.response?.data?.message || err.message}`);
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

const formatearHora = (horaObj) => {
  if (!horaObj) return '';

  try {
    const date = new Date(horaObj);
    const hours = date.getUTCHours();  // NO getHours() — usamos UTC para evitar desfase
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } catch (err) {
    console.error('Error al formatear hora:', err);
    return horaObj;
  }
};

  const reservasFiltradas = historial.filter((reserva) => {
    const coincideFecha = !filtroFecha || reserva.fecha?.startsWith(filtroFecha);
    const coincideNombre = !filtroNombre || reserva.nombre_atraccion?.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideEstado = !filtroEstado || reserva.estado?.toLowerCase() === filtroEstado;
    return coincideFecha && coincideNombre && coincideEstado;
  });

  const reservasPaginadas = reservasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const totalPaginas = Math.ceil(reservasFiltradas.length / elementosPorPagina);

  useEffect(() => {
  if (historial.length > 0) {
    console.log('🕒 Historial recibido:', historial.map(r => r.hora));
  }
}, [historial]);


  return (
<div className="dashboard-container">
      <section className="panel-botones">
        <button type="button" className="btn-toggle-form" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Crear Nueva Reserva'}
        </button>

        <button type="button" className="btn-toggle-form" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
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
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Comparar solo fecha

                    if (selectedDate.getDay() === 0) {
                      alert('⚠️ No se permiten reservas los lunes.');
                      return;
                    }

                    handleDetalleChange(index, 'fecha', e.target.value);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <div className="hora-selectores">
                  <label>Hora:</label>
                  <select
                    value={detalle.hora}
                    onChange={(e) => handleDetalleChange(index, 'hora', e.target.value)}
                    required
                  >
                    <option value="">HH</option>
                    {horas.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={detalle.minuto}
                    onChange={(e) => handleDetalleChange(index, 'minuto', e.target.value)}
                    required
                  >
                    <option value="">MM</option>
                    {minutos.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

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
            {reservasPaginadas.length === 0 ? (
              <tr><td colSpan="6">No hay reservas registradas.</td></tr>
            ) : (
              reservasPaginadas.map((reserva, idx) => (
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
        {totalPaginas > 1 && (
          <div className="paginacion">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReservaCliente;


