const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email');

// ===========================
// Registro de usuario
// ===========================
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    await poolConnect;

    // Verificar si ya existe el usuario
    const existe = await pool.request()
      .input('correo', correo)
      .query('SELECT id_usuario FROM Usuario WHERE correo = @correo');

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar en Persona (solo con nombre por ahora)
    const personaResult = await pool.request()
      .input('nombre', nombre)
      .query(`
        INSERT INTO Persona (nombre)
        OUTPUT INSERTED.id_persona
        VALUES (@nombre)
      `);

    const id_persona = personaResult.recordset[0].id_persona;

    // Asignar rol 3 (turista) por defecto
    const id_rol = 3;

    // Insertar en Usuario
    const usuarioResult = await pool.request()
      .input('id_rol', id_rol)
      .input('id_persona', id_persona)
      .input('correo', correo)
      .input('contrasena', hashedPassword)
      .input('estado', 'activo')
      .query(`
        INSERT INTO Usuario (id_rol, id_persona, correo, contrasena, estado)
        OUTPUT INSERTED.id_usuario
        VALUES (@id_rol, @id_persona, @correo, @contrasena, @estado)
      `);

    const id_usuario = usuarioResult.recordset[0].id_usuario;

    // Insertar en Turista
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('fecha_creacion', new Date())
      .query(`
        INSERT INTO Turista (id_usuario, fecha_creacion)
        VALUES (@id_usuario, @fecha_creacion)
      `);

    // Crear token de verificación
    const token = crypto.randomBytes(32).toString('hex');
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('token', token)
      .query(`
        INSERT INTO Verificacion (id_usuario, token)
        VALUES (@id_usuario, @token)
      `);

    // Enviar email
    await sendVerificationEmail(correo, token, nombre);

    res.status(201).json({
      message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error interno en el servidor' });
  }
});

// ===========================
// Login de usuario
// ===========================
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      success: false,
      message: 'Correo y contraseña son requeridos'
    });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('correo', correo)
      .query(`
        SELECT 
          U.id_usuario,
          U.correo,
          U.contrasena,
          U.verificado,
          U.estado,
          R.nombre AS rol,
          P.nombre,
          T.id_turista
        FROM Usuario U
        JOIN Rol R ON U.id_rol = R.id_rol
        JOIN Persona P ON U.id_persona = P.id_persona
        LEFT JOIN Turista T ON T.id_usuario = U.id_usuario
        WHERE U.correo = @correo
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Correo no registrado'
      });
    }

    const user = result.recordset[0];

    if (user.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está suspendida o inactiva'
      });
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    const isVerified = Boolean(user.verificado);
    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Debes verificar tu correo antes de iniciar sesión',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol,
        email: user.correo
      },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id_usuario,
        id_turista: user.id_turista, // ← esta es la parte clave
        email: user.correo,
        nombre: user.nombre,
        rol: user.rol,
        verificado: isVerified
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al iniciar sesión'
    });
  }
});


// ===========================
// Verificación de correo
// ===========================
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('token', token)
      .query(`
        SELECT * FROM Verificacion
        WHERE token = @token AND usado = 0
      `);

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Token inválido o ya usado' });
    }

    const { id_usuario } = result.recordset[0];

    // Marcar como verificado en Usuario
    await pool.request()
      .input('id_usuario', id_usuario)
      .query(`
        UPDATE Usuario SET verificado = 1 WHERE id_usuario = @id_usuario
      `);

    // Marcar token como usado
    await pool.request()
      .input('token', token)
      .query(`
        UPDATE Verificacion SET usado = 1 WHERE token = @token
      `);

    res.json({ message: '✅ Cuenta verificada correctamente' });
  } catch (err) {
    console.error('Error al verificar cuenta:', err);
    res.status(500).json({ message: '❌ Error interno al verificar la cuenta' });
  }
});









// ============================
// Obtener usuarios por parte del administrador
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
// Crear usuarios por parte del administrador
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

// ==========================================================
// Actualizar/Cambiar usuarios por parte del administrador
// ==========================================================
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

//=======================
// Eliminar usuario
//=======================
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