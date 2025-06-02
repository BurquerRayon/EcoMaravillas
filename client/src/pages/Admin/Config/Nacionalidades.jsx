import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/NacionalidadesConfig.css';

const NacionalidadesConfig = () => {
  const [nacionalidades, setNacionalidades] = useState([]);
  const [form, setForm] = useState({ nombre: '', codigo_iso: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

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
        setMensaje('✅ Nacionalidad actualizada');
      } else {
        await axios.post('http://localhost:3001/api/nacionalidades', form);
        setMensaje('✅ Nacionalidad creada');
      }
      setForm({ nombre: '', codigo_iso: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchNacionalidades();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar nacionalidad:', err);
      setMensaje('❌ Error al guardar');
    }
  };

  const handleEditar = (nac) => {
    setEditandoId(nac.id_nacionalidad);
    setForm({ nombre: nac.nombre, codigo_iso: nac.codigo_iso });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta nacionalidad?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/nacionalidades/${id}`);
              setMensaje('✅ Nacionalidad eliminada correctamente');
              fetchNacionalidades();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar nacionalidad:', err);
              setMensaje('❌ Error al eliminar nacionalidad');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleCancelar = () => {
  setForm({ nombre: '', codigo_iso: '' });
  setEditandoId(null);
  setMostrarFormulario(false);
};

  const nacionalidadesFiltradas = nacionalidades.filter(n =>
    n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.codigo_iso.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="nacionalidades-container">
      <button onClick={() => navigate('/admin/config')} className="btn-volver">
        ⬅ Volver a Configuración
      </button>

      <h2>Gestión de Nacionalidades</h2>

      <div className="acciones-nacionalidades">
      <button
        onClick={() => {
          if (mostrarFormulario) {
            handleCancelar(); // Si ya está visible, cancelar edición/creación
          } else {
            setMostrarFormulario(true); // Mostrar formulario para nueva creación
          }
        }}
        className="btn-toggle-form"
      >
        {mostrarFormulario ? '➖ Cancelar' : '➕ Crear Nueva Nacionalidad'}
      </button>


        <input
          type="text"
          placeholder="🔍 Buscar nacionalidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="nacionalidad-form">
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
          <button type="submit" className="btn-guardar">{editandoId ? 'Actualizar' : 'Crear'}</button>
        </form>
      )}

      <div className="grid-nacionalidades">
        {nacionalidadesFiltradas.map((n) => (
          <div key={n.id_nacionalidad} className="tarjeta-nacionalidad">
            <h4>{n.nombre}  ({n.codigo_iso})</h4>
            <div className="acciones">
              <button onClick={() => handleEditar(n)}>✏️ Editar</button>
              <button onClick={() => handleEliminar(n.id_nacionalidad)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NacionalidadesConfig;
