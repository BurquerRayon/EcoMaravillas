const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Crear nueva reserva
router.post('/', async (req, res) => {
const { id_usuario, id_atraccion, fecha, hora, cantidad } = req.body;

  try {
    await poolConnect;

    await pool.request()
  .input('id_usuario', id_usuario)
  .input('id_atraccion', id_atraccion)
  .input('fecha', fecha)
  .input('hora', hora)
  .input('cantidad', cantidad)
  .query(`
    INSERT INTO Reservas (id_usuario, id_atraccion, fecha, hora, cantidad)
    VALUES (@id_usuario, @id_atraccion, @fecha, @hora, @cantidad)
  `);

    res.json({ message: 'Reserva creada con éxito' });

  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
});

// Actualizar una reserva (solo fecha y hora)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, hora } = req.body;

  try {
    await poolConnect;

    await pool.request()
      .input('id', id)
      .input('fecha', fecha)
      .input('hora', hora)
      .query(`
        UPDATE Reservas
        SET fecha = @fecha, hora = @hora
        WHERE id = @id
      `);

    res.json({ message: 'Reserva actualizada correctamente' });

  } catch (err) {
    console.error('Error al actualizar reserva:', err);
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
});

// Eliminar una reserva
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Reservas WHERE id = @id AND estado != \'aprobado\'');

    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error('Error al eliminar reserva:', err);
    res.status(500).json({ message: 'Error al eliminar la reserva' });
  }
});

// Obtener reservas por usuario
router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('usuarioId', usuarioId)
      .query(`
        SELECT 
          R.id,
          R.fecha,
          LEFT(CONVERT(varchar, R.hora, 108), 5) AS hora, -- ✅ ahora solo HH:mm
          R.cantidad,
          R.estado,
          A.nombre AS atraccion
          FROM Reservas R
          INNER JOIN Atracciones A ON R.id_atraccion = A.id
          WHERE R.id_usuario = @usuarioId
          ORDER BY R.fecha DESC, R.hora DESC;
        `);


    res.json(result.recordset);

  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
});

module.exports = router;
