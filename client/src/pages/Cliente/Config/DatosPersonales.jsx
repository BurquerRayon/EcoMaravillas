import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import '../../../styles/AjustesCliente.css';

const DatosPersonalesForm = () => {
  const [datos, setDatos] = useState({
    nombre_completo: '',
    cedula: '',
    fecha_nacimiento: ''
  });
  const [mensaje, setMensaje] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id_turista) {
      axios.get(`http://localhost:3001/api/turistas/${user.id_turista}`)
        .then(res => {
          setDatos({
            nombre_completo: res.data.nombre_completo || '',
            cedula: res.data.cedula || '',
            fecha_nacimiento: res.data.fecha_nacimiento?.split('T')[0] || ''
          });
        })
        .catch(err => console.error('Error al cargar datos:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/turistas/${user.id_turista}`, datos);
      setMensaje('✅ Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMensaje('❌ Error al guardar los cambios');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="form-ajuste-cliente">
      <h3>Actualizar Datos Personales</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input
          type="text"
          name="nombre_completo"
          value={datos.nombre_completo}
          onChange={handleChange}
          required
        />

        <label>Cédula</label>
        <input
          type="text"
          name="cedula"
          value={datos.cedula}
          onChange={handleChange}
          required
        />

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          name="fecha_nacimiento"
          value={datos.fecha_nacimiento}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar</button>
      </form>
      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
    </div>
  );
};

export default DatosPersonalesForm;
