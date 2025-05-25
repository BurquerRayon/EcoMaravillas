import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/MonedasConfig.css';
import { useNavigate } from 'react-router-dom';

const MonedasConfig = () => {
  const [monedas, setMonedas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    simbolo: '$',
    codigo_iso: '',
    tasa_cambio: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchMonedas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/monedas');
      setMonedas(res.data);
    } catch (err) {
      console.error('Error al obtener monedas:', err);
    }
  };

  useEffect(() => {
    fetchMonedas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const datos = {
    ...form,
    simbolo: form.simbolo.trim() || '$'
  };

  try {
    if (editandoId) {
      await axios.put(`http://localhost:3001/api/monedas/${editandoId}`, datos);
      setMensaje('Moneda actualizada correctamente');
    } else {
      await axios.post('http://localhost:3001/api/monedas', datos);
      setMensaje('Moneda creada exitosamente');
    }

    setForm({ nombre: '', simbolo: '$', codigo_iso: '', tasa_cambio: '' });
    setEditandoId(null);
    fetchMonedas();
    setTimeout(() => setMensaje(''), 3000);
  } catch (err) {
    console.error('Error al guardar moneda:', err);
    setMensaje('Error al guardar moneda');
  }
};

  const handleEditar = (moneda) => {
    setEditandoId(moneda.id_moneda);
    setForm({
      nombre: moneda.nombre,
      simbolo: moneda.simbolo,
      codigo_iso: moneda.codigo_iso,
      tasa_cambio: moneda.tasa_cambio
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta moneda?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/monedas/${id}`);
      fetchMonedas();
    } catch (err) {
      console.error('Error al eliminar moneda:', err);
    }
  };

  return (
    <div className="monedas-container">
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

      <h2>Gestión de Monedas</h2>

      <form onSubmit={handleSubmit} className="moneda-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="simbolo"
          placeholder="Símbolo"
          value={form.simbolo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="codigo_iso"
          placeholder="Código ISO"
          value={form.codigo_iso}
          onChange={handleChange}
          maxLength={3}
          required
        />
        <input
          type="number"
          name="tasa_cambio"
          placeholder="Tasa de cambio"
          value={form.tasa_cambio}
          onChange={handleChange}
          step="0.0001"
          required
        />
        <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <ul className="lista-monedas">
        {monedas.map((m) => (
          <li key={m.id_moneda}>
            <strong>{m.nombre}</strong> ({m.codigo_iso}) - {m.simbolo} / Tasa: {m.tasa_cambio}
            <div>
              <button onClick={() => handleEditar(m)}>Editar</button>
              <button onClick={() => handleEliminar(m.id_moneda)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default MonedasConfig;
