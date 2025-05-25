import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NacionalidadesConfig = () => {
  const [nacionalidades, setNacionalidades] = useState([]);
  const [form, setForm] = useState({ nombre: '', codigo_iso: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const fetchNacionalidades = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/nacionalidades');
      setNacionalidades(res.data);
    } catch (err) {
      console.error('Error al obtener nacionalidades:', err);
    }
  };

  useEffect(() => {
    fetchNacionalidades();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/nacionalidades/${editandoId}`, form);
        setMensaje('Nacionalidad actualizada');
      } else {
        await axios.post('http://localhost:3001/api/nacionalidades', form);
        setMensaje('Nacionalidad creada');
      }
      setForm({ nombre: '', codigo_iso: '' });
      setEditandoId(null);
      fetchNacionalidades();
    } catch (err) {
      console.error('Error al guardar nacionalidad:', err);
      setMensaje('Error al guardar');
    }
  };

  const handleEditar = (nac) => {
    setEditandoId(nac.id_nacionalidad);
    setForm({ nombre: nac.nombre, codigo_iso: nac.codigo_iso });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta nacionalidad?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/nacionalidades/${id}`);
      fetchNacionalidades();
    } catch (err) {
      console.error('Error al eliminar nacionalidad:', err);
    }
  };

  return (
    <div>
      <h2>Gestión de Nacionalidades</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la nacionalidad"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="codigo_iso"
          placeholder="Código ISO (ej. DO, US)"
          maxLength={3}
          value={form.codigo_iso}
          onChange={handleChange}
          required
        />
        <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        {mensaje && <p>{mensaje}</p>}
      </form>

      <ul>
        {nacionalidades.map(n => (
          <li key={n.id_nacionalidad}>
            <strong>{n.nombre}</strong> ({n.codigo_iso})
            <button onClick={() => handleEditar(n)}>Editar</button>
            <button onClick={() => handleEliminar(n.id_nacionalidad)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NacionalidadesConfig;
