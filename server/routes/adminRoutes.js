const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db/connection');
const { obtenerEstadisticas } = require('../controllers/statsController');

// Función auxiliar para mapear roles por ID
const mapearRol = (idRol) => {
  switch (idRol) {
    case 1: return 'cliente';
    case 2: return 'empleado';
    case 3: return 'admin';
    default: return 'cliente';
  }
};

// ============================
// Ruta para obtener estadísticas
// ============================
router.get('/stats', obtenerEstadisticas);

// ============================
// Obtener todos los usuarios
// ============================
router.get('/usuarios', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT 
        U.id_usuario,
        U.correo,
        U.id_rol,
        P.nombre
      FROM Usuario U
      JOIN Persona P ON U.id_persona = P.id_persona
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// ============================
// Crear nuevo usuario
// ============================
router.post('/crear-usuario', async (req, res) => {
  const { nombre, correo, contrasena, id_rol } = req.body;
  if (!nombre || !correo || !contrasena || !id_rol) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    await poolConnect;

    const existe = await pool.request()
      .input('correo', correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const persona = await pool.request()
      .input('nombre', nombre)
      .query(`INSERT INTO Persona (nombre) OUTPUT INSERTED.id_persona AS id_persona VALUES (@nombre)`);
    const id_persona = persona.recordset[0].id_persona;

    const hash = await bcrypt.hash(contrasena, 10);

    await pool.request()
      .input('id_persona', id_persona)
      .input('correo', correo)
      .input('contrasena', hash)
      .input('estado', 'activo')
      .input('id_rol', id_rol)
      .query(`INSERT INTO Usuario (id_persona, correo, contrasena, estado, id_rol) VALUES (@id_persona, @correo, @contrasena, @estado, @id_rol)`);

    res.status(201).json({ message: 'Usuario creado correctamente' });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ============================
// Actualizar usuario
// ============================
router.put('/usuarios/:id', async (req, res) => {
  const id_usuario = req.params.id;
  const { nombre, correo, id_rol } = req.body;

  try {
    await poolConnect;

    const usuario = await pool.request()
      .input('id_usuario', id_usuario)
      .query(`SELECT id_persona FROM Usuario WHERE id_usuario = @id_usuario`);

    if (usuario.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_persona = usuario.recordset[0].id_persona;

    await pool.request()
      .input('id_usuario', id_usuario)
      .input('correo', correo)
      .input('id_rol', id_rol)
      .query(`
        UPDATE Usuario 
        SET correo = @correo, id_rol = @id_rol 
        WHERE id_usuario = @id_usuario
      `);

    await pool.request()
      .input('id_persona', id_persona)
      .input('nombre', nombre)
      .query(`
        UPDATE Persona 
        SET nombre = @nombre 
        WHERE id_persona = @id_persona
      `);

    res.status(200).json({ message: 'Usuario actualizado correctamente' });

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// ============================
// Eliminar usuario
// ============================
router.delete('/usuarios/:id', async (req, res) => {
  const id_usuario = req.params.id;

  try {
    await poolConnect;

    await pool.request()
      .input('id_usuario', id_usuario)
      .query('DELETE FROM Usuario WHERE id_usuario = @id_usuario');

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
