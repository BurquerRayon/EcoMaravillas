import React from 'react';
import '../../styles/Reports.css';
import { useNavigate } from 'react-router-dom';

const Reportes = () => {
  const navigate = useNavigate();

  const irACrear = () => {
    navigate('/admin/crear-reporte');
  };

  const verDetalles = (id) => {
    navigate(`/admin/reporte/${id}`);
  };

  const reportes = [
    {
      id: 1,
      tipo: 'Ventas',
      fechaInicio: '01/04/2025',
      fechaFin: '10/04/2025',
      generadoPor: 'Juan Pérez',
    },
    {
      id: 2,
      tipo: 'Boletos Vencidos',
      fechaInicio: '05/04/2025',
      fechaFin: '12/04/2025',
      generadoPor: 'María Gómez',
    },
    {
      id: 3,
      tipo: 'Ocupación de Autobuses',
      fechaInicio: '01/03/2025',
      fechaFin: '31/03/2025',
      generadoPor: 'Carlos Ruiz',
    },
  ];

  return (
<div className="p-8">
  <div className="flex justify-between items-center mb-espaciado">
    <h2 className="text-2xl font-bold">Reportes Generados</h2>
        <button onClick={irACrear} className="btn-primary">
          Crear Nuevo Reporte
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Fecha Inicio</th>
              <th className="px-6 py-3">Fecha Fin</th>
              <th className="px-6 py-3">Generado Por</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.id} className="border-t">
                <td className="px-6 py-4">{reporte.id}</td>
                <td className="px-6 py-4">{reporte.tipo}</td>
                <td className="px-6 py-4">{reporte.fechaInicio}</td>
                <td className="px-6 py-4">{reporte.fechaFin}</td>
                <td className="px-6 py-4">{reporte.generadoPor}</td>
                <td className="px-6 py-4">
                  <button onClick={() => verDetalles(reporte.id)} className="btn-secondary">
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
