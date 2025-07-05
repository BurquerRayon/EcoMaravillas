const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db/connection');
const { obtenerEstadisticas } = require('../controllers/statsController');
const sql = require('mssql');

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
// Rutas para gestión de empleados
// ============================

// Obtener todos los empleados
router.get('/empleados', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT 
        P.id_personal,
        P.id_usuario,
        P.especialidad,
        P.fecha_contratacion,
        P.numero_licencia,
        P.turno,
        Pe.nombre,
        U.correo
      FROM Personal P
      JOIN Usuario U ON P.id_usuario = U.id_usuario
      JOIN Persona Pe ON U.id_persona = Pe.id_persona
      ORDER BY Pe.nombre
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).json({ message: 'Error al obtener los empleados' });
  }
});

// Obtener usuarios con rol de empleado que no están en la tabla Personal
router.get('/usuarios-empleados', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT 
        U.id_usuario,
        U.correo,
        P.nombre
      FROM Usuario U
      JOIN Persona P ON U.id_persona = P.id_persona
      WHERE U.id_rol = 2 
      AND U.id_usuario NOT IN (SELECT id_usuario FROM Personal WHERE id_usuario IS NOT NULL)
      ORDER BY P.nombre
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error al obtener usuarios empleados:', err);
    res.status(500).json({ message: 'Error al obtener usuarios empleados' });
  }
});

// Crear nuevo empleado
router.post('/empleados', async (req, res) => {
  const { id_usuario, especialidad, fecha_contratacion, numero_licencia, turno } = req.body;
  
  if (!id_usuario || !especialidad || !fecha_contratacion || !numero_licencia || !turno) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    await poolConnect;

    // Verificar si el usuario ya tiene un registro en Personal
    const existe = await pool.request()
      .input('id_usuario', id_usuario)
      .query('SELECT * FROM Personal WHERE id_usuario = @id_usuario');

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: 'El usuario ya tiene un perfil de empleado' });
    }

    // Verificar si el número de licencia ya existe
    const licenciaExiste = await pool.request()
      .input('numero_licencia', numero_licencia)
      .query('SELECT * FROM Personal WHERE numero_licencia = @numero_licencia');

    if (licenciaExiste.recordset.length > 0) {
      return res.status(400).json({ message: 'El número de licencia ya está en uso' });
    }

    await pool.request()
      .input('id_usuario', id_usuario)
      .input('especialidad', especialidad)
      .input('fecha_contratacion', fecha_contratacion)
      .input('numero_licencia', numero_licencia)
      .input('turno', turno)
      .query(`
        INSERT INTO Personal (id_usuario, especialidad, fecha_contratacion, numero_licencia, turno)
        VALUES (@id_usuario, @especialidad, @fecha_contratacion, @numero_licencia, @turno)
      `);

    res.status(201).json({ message: 'Empleado creado correctamente' });

  } catch (err) {
    console.error('Error al crear empleado:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar empleado
router.put('/empleados/:id', async (req, res) => {
  const id_personal = req.params.id;
  const { id_usuario, especialidad, fecha_contratacion, numero_licencia, turno } = req.body;

  try {
    await poolConnect;

    // Verificar si el empleado existe
    const empleado = await pool.request()
      .input('id_personal', id_personal)
      .query('SELECT * FROM Personal WHERE id_personal = @id_personal');

    if (empleado.recordset.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Verificar si el número de licencia ya existe en otro empleado
    const licenciaExiste = await pool.request()
      .input('numero_licencia', numero_licencia)
      .input('id_personal', id_personal)
      .query('SELECT * FROM Personal WHERE numero_licencia = @numero_licencia AND id_personal != @id_personal');

    if (licenciaExiste.recordset.length > 0) {
      return res.status(400).json({ message: 'El número de licencia ya está en uso' });
    }

    await pool.request()
      .input('id_personal', id_personal)
      .input('id_usuario', id_usuario)
      .input('especialidad', especialidad)
      .input('fecha_contratacion', fecha_contratacion)
      .input('numero_licencia', numero_licencia)
      .input('turno', turno)
      .query(`
        UPDATE Personal 
        SET id_usuario = @id_usuario, especialidad = @especialidad, 
            fecha_contratacion = @fecha_contratacion, numero_licencia = @numero_licencia, 
            turno = @turno
        WHERE id_personal = @id_personal
      `);

    res.status(200).json({ message: 'Empleado actualizado correctamente' });

  } catch (err) {
    console.error('Error al actualizar empleado:', err);
    res.status(500).json({ message: 'Error al actualizar el empleado' });
  }
});

// Eliminar empleado
router.delete('/empleados/:id', async (req, res) => {
  const id_personal = parseInt(req.params.id);

  try {
    await poolConnect;

    // Verificar si el empleado existe
    const empleado = await pool.request()
      .input('id_personal', id_personal)
      .query('SELECT * FROM Personal WHERE id_personal = @id_personal');

    if (empleado.recordset.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await pool.request()
      .input('id_personal', id_personal)
      .query('DELETE FROM Personal WHERE id_personal = @id_personal');

    res.status(200).json({ message: 'Empleado eliminado correctamente' });

  } catch (err) {
    console.error('Error al eliminar empleado:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

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
  const id_usuario = parseInt(req.params.id);

  try {
    await poolConnect;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = transaction.request();
    request.input('id_usuario', sql.Int, id_usuario);

    // Obtener id_persona
    const personaResult = await request.query(`
      SELECT id_persona FROM Usuario WHERE id_usuario = @id_usuario
    `);
    if (personaResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const id_persona = personaResult.recordset[0].id_persona;
    request.input('id_persona', sql.Int, id_persona);

    // Si existe un turista asociado, eliminar sus datos primero
    const turistaResult = await request.query(`
      SELECT id_turista FROM Turista WHERE id_usuario = @id_usuario
    `);
    if (turistaResult.recordset.length > 0) {
      const id_turista = turistaResult.recordset[0].id_turista;
      request.input('id_turista', sql.Int, id_turista);

await request.query(`
  DELETE FROM Pagos WHERE id_reserva IN (
    SELECT id_reserva FROM Reservas WHERE id_turista IN (
      SELECT id_turista FROM Turista WHERE id_usuario = @id_usuario
    )
  );
  DELETE FROM Reserva_Detalles WHERE id_reserva IN (
    SELECT id_reserva FROM Reservas WHERE id_turista IN (
      SELECT id_turista FROM Turista WHERE id_usuario = @id_usuario
    )
  );
  DELETE FROM Reservas WHERE id_turista IN (
    SELECT id_turista FROM Turista WHERE id_usuario = @id_usuario
  );
  DELETE FROM Turista_Documentos WHERE id_usuario = @id_usuario;
  DELETE FROM Turista WHERE id_usuario = @id_usuario;
`);
    }

    // Eliminar el resto de relaciones
await request.query(`
  DELETE FROM RecuperacionPassword WHERE id_usuario = @id_usuario;
  DELETE FROM Verificacion WHERE id_usuario = @id_usuario;
  DELETE FROM Reporte WHERE id_usuario = @id_usuario;
  DELETE FROM Personal WHERE id_usuario = @id_usuario;
  DELETE FROM Notificacion WHERE id_usuario = @id_usuario;
  DELETE FROM Usuario WHERE id_usuario = @id_usuario;
  DELETE FROM Persona WHERE id_persona = @id_persona;
`);

    await transaction.commit();
    res.status(200).json({ message: '✅ Usuario eliminado correctamente.' });
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    res.status(500).json({ message: '❌ Error interno del servidor' });
  }
});

module.exports = router;
