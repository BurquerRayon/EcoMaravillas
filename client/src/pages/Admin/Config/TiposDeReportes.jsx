import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/ReportesConfig.css';
import { useNavigate } from 'react-router-dom';

const ReportesConfig = () => {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchTipos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/reportes');
      setTipos(res.data);
    } catch (err) {
      console.error('Error al obtener tipos:', err);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/reportes/${editandoId}`, form);
        setMensaje('Tipo de reporte actualizado');
      } else {
        await axios.post('http://localhost:3001/api/reportes', form);
        setMensaje('Tipo de reporte creado');
      }

      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      fetchTipos();
    } catch (err) {
      console.error('Error al guardar tipo:', err);
      setMensaje('Error al guardar');
    }
  };

  const handleEditar = (tipo) => {
    setEditandoId(tipo.id_tipo_reporte);
    setForm({ nombre: tipo.nombre, descripcion: tipo.descripcion });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este tipo de reporte?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/reportes/${id}`);
      fetchTipos();
    } catch (err) {
      console.error('Error al eliminar tipo:', err);
    }
  };

  return (
    <div className="reportes-config-container">

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

      <h2>Gestión de Tipos de Reporte</h2>

      <form onSubmit={handleSubmit} className="reportes-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del tipo"
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

      <ul className="lista-tipos">
        {tipos.map((tipo) => (
          <li key={tipo.id_tipo_reporte}>
            <strong>{tipo.nombre}</strong>: {tipo.descripcion}
            <div>
              <button onClick={() => handleEditar(tipo)}>Editar</button>
              <button onClick={() => handleEliminar(tipo.id_tipo_reporte)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportesConfig;
