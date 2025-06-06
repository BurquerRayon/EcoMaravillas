import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportesAdmin = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel de Reportes</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>Usuarios: {stats.usuarios}</div>
        <div style={cardStyle}>Reservas: {stats.reservas}</div>
        <div style={cardStyle}>Atracciones: {stats.atracciones}</div>
        <div style={cardStyle}>Ingresos Totales: ${stats.ingresos.toFixed(2)}</div>
      </div>

      <h3 style={{ marginTop: '40px' }}>Ingresos Mensuales</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {stats.ingresosPorMes.map((mes, index) => (
            <tr key={index}>
              <td>{mes.mes}</td>
              <td>${mes.ingresos_mes.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '20px',
  minWidth: '150px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

export default ReportesAdmin;
