import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/RolesConfig.css';
import { useNavigate } from 'react-router-dom';

const RolesConfig = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('Error al obtener roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/roles/${editandoId}`, form);
        setMensaje('Rol actualizado');
      } else {
        await axios.post('http://localhost:3001/api/roles', form);
        setMensaje('Rol creado');
      }
      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      fetchRoles();
    } catch (err) {
      console.error('Error guardando rol:', err);
      setMensaje('Error al guardar');
    }
  };

  const handleEditar = (rol) => {
    setEditandoId(rol.id_rol);
    setForm({ nombre: rol.nombre, descripcion: rol.descripcion });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este rol?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error('Error al eliminar rol:', err);
    }
  };

  return (
    <div className="roles-container">
      <button onClick={() => navigate('/admin/config')} style={{
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '1rem'
      }}>
        ⬅ Volver a Configuración
      </button>
      
      <h2>Gestión de Roles</h2>

      <form onSubmit={handleSubmit} className="roles-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del rol"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
        <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <ul className="lista-roles">
        {roles.map((rol) => (
          <li key={rol.id_rol}>
            <strong>{rol.nombre}</strong>: {rol.descripcion}
            <div>
              <button onClick={() => handleEditar(rol)}>Editar</button>
              <button onClick={() => handleEliminar(rol.id_rol)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolesConfig;
