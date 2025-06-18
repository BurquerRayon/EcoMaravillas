import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/HistorialReservas.css';

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    atraccion: ''
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const id_turista = user?.id_turista;

  useEffect(() => {
    if (id_turista) {
      cargarHistorial();
    }
  }, [id_turista, filtros]);

  const cargarHistorial = async () => {
    try {
      let url = `http://localhost:3001/api/reservas/turista/${id_turista}?completo=true`;
      
      // Añadir filtros si existen
      const params = new URLSearchParams();
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.atraccion) params.append('atraccion', filtros.atraccion);
      
      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const res = await axios.get(url);
      setReservas(res.data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
    setPaginaActual(1); // Resetear a primera página al cambiar filtros
  };

  const resetFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      atraccion: ''
    });
  };

  // Calcular paginación
  const totalPaginas = Math.ceil(reservas.length / elementosPorPagina);
  const reservasPaginadas = reservas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <div className="historial-container">
      <h2>Historial Completo de Reservas</h2>
      
      <div className="filtros-container">
        <div className="filtro-group">
          <label>Desde:</label>
          <input 
            type="date" 
            name="fechaDesde" 
            value={filtros.fechaDesde}
            onChange={handleFiltroChange}
          />
        </div>
        
        <div className="filtro-group">
          <label>Hasta:</label>
          <input 
            type="date" 
            name="fechaHasta" 
            value={filtros.fechaHasta}
            onChange={handleFiltroChange}
          />
        </div>
        
        <div className="filtro-group">
          <label>Estado:</label>
          <select 
            name="estado" 
            value={filtros.estado}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        
        <div className="filtro-group">
          <label>Atracción:</label>
          <input 
            type="text" 
            name="atraccion" 
            value={filtros.atraccion}
            onChange={handleFiltroChange}
            placeholder="Nombre de atracción"
          />
        </div>
        
        <button onClick={resetFiltros}>Limpiar Filtros</button>
      </div>
      
      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Atracción</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservasPaginadas.length === 0 ? (
            <tr>
              <td colSpan="7">No hay reservas que coincidan con los filtros</td>
            </tr>
          ) : (
            reservasPaginadas.map((reserva, index) => (
              <tr key={index}>
                <td>{reserva.fecha?.split('T')[0]}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.nombre_atraccion}</td>
                <td>{reserva.cantidad}</td>
                <td>${reserva.subtotal?.toFixed(2)}</td>
                <td className={`estado-${reserva.estado}`}>
                  {reserva.estado}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/client/reservas/detalle/${reserva.id_reserva}`)}
                    title="Ver detalles"
                  >
                    👁️
                  </button>
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
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>
          
          <span>Página {paginaActual} de {totalPaginas}</span>
          
          <button 
            disabled={paginaActual === totalPaginas} 
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorialReservas;