import React from 'react';
import '../../styles/GestionUsuarios.css';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const usuariosMock = [
  {
    id: 1,
    nombre: 'Laura Martínez',
    correo: 'laura.martinez@email.com',
    rol: 'Administrador',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Carlos Pérez',
    correo: 'carlos.perez@email.com',
    rol: 'Empleado',
    estado: 'Inactivo',
  },
  {
    id: 3,
    nombre: 'María Gómez',
    correo: 'maria.gomez@email.com',
    rol: 'Cliente',
    estado: 'Activo',
  },
];

const GestionUsuarios = () => {
  const navigate = useNavigate();

  return (
    <div className="gestion-usuarios">
      <div className="header">
        <h2>Gestión de Usuarios</h2>
        <button onClick={() => navigate('/admin/crear-usuario')}>
          + Crear Usuario
        </button>
      </div>

      <div className="tabla-usuarios">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosMock.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>
                  <span
                    className={`estado ${
                      usuario.estado.toLowerCase() === 'activo'
                        ? 'activo'
                        : 'inactivo'
                    }`}
                  >
                    {usuario.estado}
                  </span>
                </td>
                <td className="acciones">
                  <button className="edit">
                    <Pencil size={16} />
                  </button>
                  <button className="delete">
                    <Trash2 size={16} />
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

export default GestionUsuarios;
