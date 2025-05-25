import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Permisos.css';

const PermisosConfig = () => {
  const [permisos, setPermisos] = useState([]);
  const [form, setForm] = useState({ nombre_permiso: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchPermisos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/permisos');
      setPermisos(res.data);
    } catch (err) {
      console.error('Error al obtener permisos:', err);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/permisos/${editandoId}`, form);
        setMensaje('Permiso actualizado');
      } else {
        await axios.post('http://localhost:3001/api/permisos', form);
        setMensaje('Permiso creado');
      }
      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      fetchPermisos();
    } catch (err) {
      console.error('Error al guardar permiso:', err);
      setMensaje('Error al guardar');
    }
  };

  const handleEditar = (permiso) => {
    setEditandoId(permiso.id_permiso);
    setForm({
    nombre_permiso: permiso.nombre_permiso,
    descripcion: permiso.descripcion
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este permiso?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/permisos/${id}`);
      fetchPermisos();
    } catch (err) {
      console.error('Error al eliminar permiso:', err);
    }
  };

  return (
    <div className="permisos-container">
      <button onClick={() => navigate('/admin/config')} className="btn-volver">⬅ Volver a Configuración</button>
      <h2>Gestión de Permisos</h2>

      <form onSubmit={handleSubmit} className="permisos-form">
      <input
        type="text"
        name="nombre_permiso"
        placeholder="Nombre del permiso"
        value={form.nombre_permiso}
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

      <ul className="lista-permisos">
        {permisos.map((permiso) => (
          <li key={permiso.id_permiso}>
            <strong>{permiso.nombre_permiso}</strong>: {permiso.descripcion}
            <div>
              <button onClick={() => handleEditar(permiso)}>Editar</button>
              <button onClick={() => handleEliminar(permiso.id_permiso)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermisosConfig;
