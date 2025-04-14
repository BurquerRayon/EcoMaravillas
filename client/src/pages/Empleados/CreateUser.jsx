import React, { useState } from 'react';
import '../../styles/CreateUser.css';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'Cliente',
    estado: 'Activo',
  });

  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Usuario a crear:', formData);

    setMensajeExito('✅ Usuario creado exitosamente');

    // Simula una espera de 2 segundos antes de redirigir
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 2000);
  };

  const handleCancelar = () => {
    navigate('/admin/usuarios');
  };

  return (
    <div className="crear-usuario">
      <h2>Crear Nuevo Usuario</h2>

      {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label>Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="Administrador">Administrador</option>
            <option value="Empleado">Empleado</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        <div className="campo">
          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="acciones-formulario">
          <button type="submit">Crear Usuario</button>
          <button type="button" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CrearUsuario;
