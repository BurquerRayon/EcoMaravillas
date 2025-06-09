// backend/routes/cliente.js
const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener datos personales del cliente por ID de usuario
router.get('/:id_usuario/datos-personales', async (req, res) => {
const { id_usuario } = req.params;

try {
await poolConnect;
const result = await pool.request()
  .input('id_usuario', id_usuario)
  .query(`
    SELECT P.nombre, P.apellido, P.cedula, P.fecha_nacimiento, P.edad,
           P.id_nacionalidad, N.nombre AS nacionalidad,
           P.id_sexo, S.nombre AS sexo
    FROM Usuario U
    JOIN Persona P ON U.id_persona = P.id_persona
    LEFT JOIN Nacionalidad N ON P.id_nacionalidad = N.id_nacionalidad
    LEFT JOIN Sexo S ON P.id_sexo = S.id_sexo
    WHERE U.id_usuario = @id_usuario
  `);

if (result.recordset.length === 0) {
  return res.status(404).json({ message: 'Datos no encontrados' });
}

res.json(result.recordset[0]);
} catch (err) {
console.error('Error al obtener datos personales:', err);
res.status(500).json({ message: 'Error interno al obtener los datos personales' });
}
});

// Actualizar datos personales del cliente
router.put('/:id_usuario/datos-personales', async (req, res) => {
const { id_usuario } = req.params;
const { nombre, apellido, cedula, fecha_nacimiento, edad, id_nacionalidad, id_sexo } = req.body;

try {
await poolConnect;
const personaResult = await pool.request()
  .input('id_usuario', id_usuario)
  .query(`SELECT id_persona FROM Usuario WHERE id_usuario = @id_usuario`);

if (personaResult.recordset.length === 0) {
  return res.status(404).json({ message: 'Usuario no encontrado' });
}

const id_persona = personaResult.recordset[0].id_persona;

await pool.request()
  .input('id_persona', id_persona)
  .input('nombre', nombre)
  .input('apellido', apellido)
  .input('cedula', cedula)
  .input('fecha_nacimiento', fecha_nacimiento)
  .input('edad', edad)
  .input('id_nacionalidad', id_nacionalidad)
  .input('id_sexo', id_sexo)
  .query(`
    UPDATE Persona
    SET nombre = @nombre,
        apellido = @apellido,
        cedula = @cedula,
        fecha_nacimiento = @fecha_nacimiento,
        edad = @edad,
        id_nacionalidad = @id_nacionalidad,
        id_sexo = @id_sexo
    WHERE id_persona = @id_persona
  `);

res.json({ message: '✅ Datos personales actualizados correctamente' });
} catch (err) {
console.error('Error al actualizar datos personales:', err);
res.status(500).json({ message: 'Error interno al actualizar los datos personales' });
}
});

module.exports = router;