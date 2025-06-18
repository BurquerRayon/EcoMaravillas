import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ReservaCliente.css';

const ReservaCliente = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [bloquearReservaDuplicada, setBloquearReservaDuplicada] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  // Estados para filtros y paginación
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const user = JSON.parse(localStorage.getItem('user'));
  const id_turista = user?.id_turista;

  // Función para formatear hora
  const formatearHora = (horaObj) => {
    if (!horaObj) return '';

    try {
      const date = new Date(horaObj);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch (err) {
      console.error('Error al formatear hora:', err);
      return horaObj;
    }
  };

  // Generar bloques horarios
const generarBloquesHorario = (inicio, fin) => {
  const bloques = [];
  let [h, m] = inicio.split(':').map(Number);
  const [hFin] = fin.split(':').map(Number);

  while (h < hFin || (h === hFin && m === 0)) {
    // No incluir el bloque de 17:00
    if (!(h === 17 && m === 0)) {
      bloques.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    m += 30;
    if (m >= 60) {
      h += 1;
      m = 0;
    }
  }
  return bloques;
};

  // Verificar reservas duplicadas
  const existeReservaDuplicada = (nuevoDetalle, indexActual = -1) => {
    return detalles.some((detalle, index) => 
      index !== indexActual &&
      detalle.id_atraccion &&
      detalle.id_atraccion === nuevoDetalle.id_atraccion &&
      detalle.fecha &&
      detalle.fecha === nuevoDetalle.fecha &&
      detalle.hora &&
      detalle.hora === nuevoDetalle.hora
    );
  };

  // Cargar datos iniciales
  useEffect(() => {
    axios.get('http://localhost:3001/api/atracciones')
      .then(res => setAtracciones(res.data))
      .catch(err => console.error('Error al cargar atracciones:', err));

    axios.get('http://localhost:3001/api/config/horario-reservas')
      .then(res => {
        const { hora_inicio, hora_fin } = res.data;
        setHorarios(generarBloquesHorario(hora_inicio, hora_fin));
      })
      .catch(() => setHorarios(generarBloquesHorario('09:00', '17:00')));

    if (id_turista) cargarHistorial();
  }, [id_turista]);

  // Aplicar filtros al historial
  useEffect(() => {
    if (historial.length > 0) {
      const filtrado = historial.filter((reserva) => {
        const coincideFecha = !filtroFecha || reserva.fecha?.split('T')[0] === filtroFecha;
        const coincideNombre = !filtroNombre || 
          reserva.nombre_atraccion?.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideEstado = !filtroEstado || 
          reserva.estado?.toLowerCase() === filtroEstado.toLowerCase();
        return coincideFecha && coincideNombre && coincideEstado;
      });
      setHistorialFiltrado(filtrado);
      setPaginaActual(1);
    }
  }, [historial, filtroFecha, filtroNombre, filtroEstado]);

  // Manejar cambios en los detalles
  const handleDetalleChange = (index, field, value) => {
    const nuevaLista = [...detalles];
    nuevaLista[index][field] = value;

    if (field === 'id_atraccion') {
      const atraccion = atracciones.find(a => a.id_atraccion === parseInt(value));
      if (atraccion) nuevaLista[index].tarifa_unitaria = atraccion.precio;
    }

    // Verificar duplicados después de cambios relevantes
    if (field === 'id_atraccion' || field === 'fecha' || field === 'hora') {
      const detalleModificado = { ...nuevaLista[index] };
      const esDuplicado = existeReservaDuplicada(detalleModificado, index);
      
      if (esDuplicado) {
        setMensaje('⚠️ Ya tienes una reserva para esta atracción en la misma fecha y hora');
        setBloquearReservaDuplicada(true);
      } else {
        setBloquearReservaDuplicada(false);
        setMensaje('');
      }
    }

    // Calcular subtotal
    const cantidad = parseInt(nuevaLista[index].cantidad) || 0;
    const tarifa = parseFloat(nuevaLista[index].tarifa_unitaria) || 0;
    nuevaLista[index].subtotal = cantidad * tarifa;

    setDetalles(nuevaLista);
  };

  // Función para manejar cambio de fecha con validación de lunes
  const handleFechaChange = (e, index) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar que no sea lunes (1 = Lunes)
    if (selectedDate.getDay() === 0) {
      setMensaje('⚠️ No se permiten reservas los lunes. Por favor seleccione otro día.');
      
      // Resetear el valor del input de fecha
      const nuevaLista = [...detalles];
      nuevaLista[index].fecha = '';
      setDetalles(nuevaLista);
      
      return;
    }

    // Validar que la fecha no sea en el pasado
    if (selectedDate < today) {
      setMensaje('⚠️ No puedes reservar para fechas pasadas');
      return;
    }

    handleDetalleChange(index, 'fecha', e.target.value);
  };

  // Agregar nuevo detalle
  const agregarDetalle = () => {
    const nuevoDetalle = {
      id_atraccion: '',
      cantidad: 1,
      fecha: '',
      hora: horarios[0] || '09:00',
      tarifa_unitaria: 0,
      subtotal: 0
    };

    setDetalles(prev => [...prev, nuevoDetalle]);
    setBloquearReservaDuplicada(false);
    setMensaje('');
  };

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    const nueva = detalles.filter((_, i) => i !== index);
    setDetalles(nueva);
    
    // Verificar si quedan duplicados después de eliminar
    const hayDuplicados = nueva.some((detalle, idx) => 
      existeReservaDuplicada(detalle, idx)
    );
    
    setBloquearReservaDuplicada(hayDuplicados);
    if (!hayDuplicados) setMensaje('');
  };

  // Cancelar creación de nueva reserva
  const cancelarCreacion = () => {
    setDetalles([]);
    setMostrarFormulario(false);
    setMensaje('');
    setBloquearReservaDuplicada(false);
  };

  // Cancelar edición de reserva
  const cancelarEdicion = () => {
    setDetalles([]);
    setReservaEditando(null);
    setModoEdicion(false);
    setMostrarFormulario(false);
    setMensaje('');
    setBloquearReservaDuplicada(false);
  };

  // Cargar detalles de reserva para edición
// Función para cargar reserva para edición (versión mejorada)
const cargarReservaParaEdicion = async (id_reserva) => {
  try {
    // Verificar que tenemos un ID de reserva válido
    if (!id_reserva) {
      setMensaje('❌ No se proporcionó un ID de reserva válido');
      return;
    }

    // Mostrar mensaje de carga
    setMensaje('Cargando reserva...');

    // 1. Obtener información básica de la reserva
    const response = await axios.get(`http://localhost:3001/api/reservas/${id_reserva}`);
    const reserva = response.data;
    
    // Verificar si la respuesta es válida
    if (!reserva) {
      setMensaje('❌ No se encontró la reserva solicitada');
      return;
    }

    // Verificar si se puede editar
    if (reserva.estado === 'confirmado' && reserva.ediciones >= 1) {
      setMensaje('❌ Solo puedes editar una vez las reservas confirmadas');
      return;
    }
    
    if (reserva.estado === 'pendiente' && reserva.ediciones >= 2) {
      setMensaje('❌ Solo puedes editar máximo 2 veces las reservas pendientes');
      return;
    }
    
    if (reserva.estado === 'cancelado') {
      setMensaje('❌ No se pueden editar reservas canceladas');
      return;
    }

    // 2. Obtener los detalles de la reserva
    const detallesReserva = await axios.get(`http://localhost:3001/api/reservas/${id_reserva}/detalles`);
    
    // Verificar que hay detalles
    if (!detallesReserva.data || detallesReserva.data.length === 0) {
      setMensaje('❌ La reserva no tiene detalles asociados');
      return;
    }

    // Formatear los detalles para el estado
    const detallesFormateados = detallesReserva.data.map(d => ({
      id_atraccion: d.id_atraccion,
      cantidad: d.cantidad,
      fecha: d.fecha.split('T')[0], // Asegurar formato de fecha correcto
      hora: d.hora,
      tarifa_unitaria: d.tarifa_unitaria,
      subtotal: d.subtotal
    }));
    
    // Actualizar el estado
    setDetalles(detallesFormateados);
    setReservaEditando(id_reserva);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setMensaje(`Editando reserva #${id_reserva}`);
    
  } catch (err) {
    console.error('Error completo al cargar reserva para edición:', err);
    
    let errorMsg = '❌ Error al cargar la reserva para edición';
    
    if (err.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      errorMsg += `: ${err.response.data.message || err.response.statusText}`;
      console.error('Detalles del error:', err.response.data);
    } else if (err.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      errorMsg += ': No se recibió respuesta del servidor';
      console.error('No hay respuesta:', err.request);
    } else {
      // Algo pasó al configurar la solicitud
      errorMsg += `: ${err.message}`;
    }
    
    setMensaje(errorMsg);
  }
};

  // Cancelar una reserva existente
  const cancelarReserva = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/reservas/cancelar/${id_reserva}`);
      setMensaje(response.data.message || '✅ Reserva cancelada');
      cargarHistorial();
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Error al cancelar la reserva';
      setMensaje(msg);
      console.error('Error al cancelar reserva:', msg);
    }
  };

  // Enviar reserva (creación o edición)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bloquearReservaDuplicada) {
      setMensaje('❌ Corrige las reservas duplicadas antes de continuar');
      return;
    }

    if (!id_turista) {
      setMensaje('❌ No se encontró el ID del usuario');
      return;
    }

    // Validar que no haya fechas en lunes
    const hayLunes = detalles.some(d => {
      if (!d.fecha) return false;
      const dia = new Date(d.fecha).getDay();
      return dia === 0; // 1 = Lunes
    });

    if (hayLunes) {
      setMensaje('❌ No se permiten reservas los lunes');
      return;
    }

    const esValido = detalles.every(d =>
      d.id_atraccion && d.cantidad > 0 && d.fecha && d.hora
    );

    if (!esValido) {
      setMensaje('❌ Complete todos los campos correctamente');
      return;
    }

    try {
      if (modoEdicion && reservaEditando) {
        // Lógica para editar reserva
        const response = await axios.put(`http://localhost:3001/api/reservas/editar/${reservaEditando}`, {
          id_turista,
          detalles
        });

        setMensaje(response.data.message || '✅ Reserva actualizada');
        setDetalles([]);
        setReservaEditando(null);
        setModoEdicion(false);
        cargarHistorial();
        setMostrarFormulario(false);
      } else {
        // Lógica para crear nueva reserva
        const response = await axios.post('http://localhost:3001/api/reservas/crear', {
          id_turista,
          detalles
        });

        setMensaje(response.data.message || '✅ Reserva creada');
        setDetalles([]);
        cargarHistorial();
        setMostrarFormulario(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Error al procesar la reserva';
      setMensaje(msg);
      console.error('Error en reserva:', msg);
    }
  };

  // Cargar historial de reservas
  const cargarHistorial = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/reservas/turista/${id_turista}`);
      setHistorial(res.data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  };

  // Calcular total
  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

  // Calcular paginación
  const totalPaginas = Math.ceil(historialFiltrado.length / elementosPorPagina);
  const historialPaginado = historialFiltrado.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <div className="dashboard-container">
      <h2>Reservas</h2>

      <div className="panel-botones">
        <button onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          if (mostrarFormulario) {
            cancelarCreacion();
            cancelarEdicion();
          }
        }}>
          {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Crear Nueva Reserva'}
        </button>
        
        <button onClick={() => setMostrarFiltros(!mostrarFiltros)}>
          {mostrarFiltros ? '➖ Ocultar Búsqueda' : '🔍 Buscar Reservas'}
        </button>
      </div>

      {mostrarFiltros && (
        <div className="filtros-reserva">
          <h3>Filtrar Reservas</h3>
          <div className="filtros-grid">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              placeholder="Filtrar por fecha"
            />
            
            <input
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Filtrar por atracción"
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
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="reserva-form">
          <p className="info-dias">
            <strong>Horario de reservas:</strong> Martes a Domingo<br />
            <span className="cerrado-lunes">❌ Los lunes el parque permanece cerrado</span>
          </p>
          
          {modoEdicion && (
            <div className="modo-edicion-info">
              <strong>Editando reserva #{reservaEditando}</strong>
              <button type="button" onClick={cancelarEdicion} className="boton-cancelar">
                Cancelar Edición
              </button>
            </div>
          )}
          
          {detalles.map((detalle, idx) => {
            const esDuplicado = existeReservaDuplicada(detalle, idx);
            const esFechaInvalida = detalle.fecha && new Date(detalle.fecha).getDay() === 0;
            
            return (
              <div key={idx} className={`reserva-linea ${esDuplicado || esFechaInvalida ? 'error-duplicado' : ''}`}>
                <select
                  value={detalle.id_atraccion}
                  onChange={(e) => handleDetalleChange(idx, 'id_atraccion', e.target.value)}
                  required
                >
                  <option value="">Seleccione una atracción</option>
                  {atracciones.map(a => (
                    <option key={a.id_atraccion} value={a.id_atraccion}>
                      {a.nombre} - ${a.precio}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(idx, 'cantidad', e.target.value)}
                  required
                />

                <input
                  type="date"
                  value={detalle.fecha}
                  onChange={(e) => handleFechaChange(e, idx)}
                  onFocus={(e) => {
                    // Bloqueo de lunes en el selector nativo
                    const input = e.target;
                    input.addEventListener('input', function() {
                      const day = new Date(this.value).getDay();
                      if (day === 0) {
                        this.value = '';
                        setMensaje('⚠️ No se permiten reservas los lunes');
                      }
                    });
                  }}
                  className={esFechaInvalida ? 'fecha-invalida' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <select
                  value={detalle.hora}
                  onChange={(e) => handleDetalleChange(idx, 'hora', e.target.value)}
                  required>
                    
                  {horarios.map(h => (
                    <option key={h} value={h}>{h.replace('Hora ', '')}</option>
                  ))}
                </select>

                <span>Subtotal: ${detalle.subtotal.toFixed(2)}</span>

                {detalles.length > 1 && (
                  <button type="button" onClick={() => eliminarDetalle(idx)}>🗑</button>
                )}
              </div>
            );
          })}

          <div className="acciones-formulario">
            <button type="button" onClick={agregarDetalle}>+ Agregar</button>
            <h4>Total: ${total.toFixed(2)}</h4>
            
            <div className="botones-accion">
              {!modoEdicion && (
                <button 
                  type="button" 
                  onClick={cancelarCreacion}
                  className="boton-cancelar"
                >
                  Cancelar Reserva
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={bloquearReservaDuplicada || detalles.some(d => 
                  d.fecha && new Date(d.fecha).getDay() === 0
                )}
              >
                {modoEdicion ? 'Actualizar Reserva' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
          
        </form>
      )}

      <h3>Historial de reservas</h3>
          {mensaje && (
            <p className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
              {mensaje}
            </p>
          )}

      <table className="tabla-reservas">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Atracción</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Ediciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historialFiltrado.length === 0 ? (
            <tr><td colSpan="9">No hay reservas que coincidan con los filtros.</td></tr>
          ) : (
            historialFiltrado.map((r, idx) => (
              <tr key={idx}>
                <td>{r.fecha?.split('T')[0]}</td>
                <td>{formatearHora(r.hora)}</td>
                <td>{r.nombre_atraccion}</td>
                <td>{r.cantidad}</td>
                <td>${r.subtotal?.toFixed(2)}</td>
                <td>{r.estado}</td>
                <td>{r.ediciones}</td>
                <td className="acciones-reserva">
                  {r.estado !== 'cancelado' && (
                    <>
                      <button 
                        onClick={() => cargarReservaParaEdicion(r.id_reserva)}
                        disabled={
                          (r.estado === 'confirmado' && r.ediciones >= 1) ||
                          (r.estado === 'pendiente' && r.ediciones >= 2)
                        }
                        title={
                          (r.estado === 'confirmado' && r.ediciones >= 1) ? 
                          'Solo puedes editar 1 vez las reservas confirmadas' :
                          (r.estado === 'pendiente' && r.ediciones >= 2) ?
                          'Solo puedes editar máximo 2 veces las reservas pendientes' :
                          'Editar reserva'
                        }
                      >
                        ✏️
                      </button>
                      
                      {r.estado !== 'confirmado' && (
                        <button 
                          onClick={() => cancelarReserva(r.id_reserva)}
                          title="Cancelar reserva"
                        >
                          ❌
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
  <div className="paginacion">
    <button 
      disabled={paginaActual === 1} 
      onClick={() => setPaginaActual(1)}
      title="Primera página"
    >
      «
    </button>
    
    <button 
      disabled={paginaActual === 1} 
      onClick={() => setPaginaActual(paginaActual - 1)}
      title="Página anterior"
    >
      ‹
    </button>
    
    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
      let pagina;
      if (totalPaginas <= 5) {
        pagina = i + 1;
      } else if (paginaActual <= 3) {
        pagina = i + 1;
      } else if (paginaActual >= totalPaginas - 2) {
        pagina = totalPaginas - 4 + i;
      } else {
        pagina = paginaActual - 2 + i;
      }
      
      return (
        <button
          key={i}
          onClick={() => setPaginaActual(pagina)}
          className={paginaActual === pagina ? 'active' : ''}
        >
          {pagina}
        </button>
      );
    })}
    
    <button 
      disabled={paginaActual === totalPaginas} 
      onClick={() => setPaginaActual(paginaActual + 1)}
      title="Página siguiente"
    >
      ›
    </button>
    
    <button 
      disabled={paginaActual === totalPaginas} 
      onClick={() => setPaginaActual(totalPaginas)}
      title="Última página"
    >
      »
    </button>
    
    <span className="info-paginacion">
      Página {paginaActual} de {totalPaginas}
    </span>
  </div>
)}
    </div>
  );
};

export default ReservaCliente;