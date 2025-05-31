const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db/connection');

const mapearRol = (idRol) => {
  switch (idRol) {
    case 1: return 'cliente';
    case 2: return 'empleado';
    case 3: return 'admin';
    default: return 'cliente';
  }
};
// ============================
// Registro
// ============================
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  if (!nombre || !correo || !contrasena) {
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

    // Insertar en Persona
    const persona = await pool.request()
      .input('nombre', nombre)
      .query(`
        INSERT INTO Persona (nombre)
        OUTPUT INSERTED.id_persona AS id_persona
        VALUES (@nombre)
      `);
    const id_persona = persona.recordset[0].id_persona;

    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar en Usuario
    const usuario = await pool.request()
      .input('id_persona', id_persona)
      .input('correo', correo)
      .input('contrasena', hash)
      .input('estado', 'activo')
      .input('id_rol', 1) // cliente por defecto
      .query(`
        INSERT INTO Usuario (id_persona, correo, contrasena, estado, id_rol)
        OUTPUT INSERTED.id_usuario AS id_usuario
        VALUES (@id_persona, @correo, @contrasena, @estado, @id_rol)
      `);

    const id_usuario = usuario.recordset[0].id_usuario;

    // Insertar en Turista
    await pool.request()
      .input('id_usuario', id_usuario)
      .query(`
        INSERT INTO Turista (id_usuario, fecha_creacion)
        VALUES (@id_usuario, GETDATE())
      `);

    res.status(201).json({ message: 'Usuario registrado con éxito' });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ============================
// Login
// ============================
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('correo', correo)
      .query(`
        SELECT 
          U.id_usuario,
          U.contrasena,
          U.estado,
          U.id_rol,
          P.nombre,
          T.id_turista
        FROM Usuario U
        JOIN Persona P ON U.id_persona = P.id_persona
        LEFT JOIN Turista T ON U.id_usuario = T.id_usuario
        WHERE U.correo = @correo
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.recordset[0];
    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Buscar id_turista si aplica
    let id_turista = null;
    if (usuario.id_rol === 1) {
      const turistaRes = await pool.request()
        .input('id_usuario', usuario.id_usuario)
        .query(`SELECT id_turista FROM Turista WHERE id_usuario = @id_usuario`);

      if (turistaRes.recordset.length > 0) {
        id_turista = turistaRes.recordset[0].id_turista;
      }
    }

    res.status(200).json({
    user: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      correo,
      rol: mapearRol(usuario.id_rol),
      id_turista: usuario.id_turista || null // Puede ser null si no aplica
    }
  });

  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;