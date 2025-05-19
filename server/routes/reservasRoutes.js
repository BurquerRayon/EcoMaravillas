const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Crear nueva reserva con validaciones
router.post('/', async (req, res) => {
  const { id_usuario, id_atraccion, fecha, hora, cantidad } = req.body;

  try {
    // Validar día lunes
    const [ano, mes, dia] = fecha.split('-');
    const fechaUTC = new Date(Date.UTC(ano, mes - 1, dia));
    const diaSemana = fechaUTC.getUTCDay(); // 0=domingo, 1=lunes...

    if (diaSemana === 1) {
      return res.status(400).json({ message: 'El parque está cerrado los lunes.' });
    }

    // Validar horario permitido (09:00–17:00)
    const [horaStr, minutoStr] = hora.split(':');
    const horaNum = parseInt(horaStr, 10);
    const minutoNum = parseInt(minutoStr, 10);

    if (
      horaNum < 9 ||
      horaNum > 17 ||
      (horaNum === 17 && minutoNum > 0)
    ) {
      return res.status(400).json({ message: 'La hora debe estar entre 09:00 y 17:00.' });
    }

    await poolConnect;

    await pool.request()
      .input('id_usuario', id_usuario)
      .input('id_atraccion', id_atraccion)
      .input('fecha', fecha)
      .input('hora', hora)
      .input('cantidad', cantidad)
      .input('estado', 'pendiente')
      .query(`
        INSERT INTO Reservas (id_usuario, id_atraccion, fecha, hora, cantidad, estado)
        VALUES (@id_usuario, @id_atraccion, @fecha, @hora, @cantidad, @estado)
      `);

    res.status(201).json({ message: 'Reserva creada con éxito' });

  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
});

// Obtener historial por usuario
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
          LEFT(CONVERT(varchar, R.hora, 108), 5) AS hora,
          R.cantidad,
          R.estado,
          A.nombre AS atraccion
        FROM Reservas R
        INNER JOIN Atracciones A ON R.id_atraccion = A.id
        WHERE R.id_usuario = @usuarioId
        ORDER BY R.fecha DESC, R.hora DESC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
});

// Editar reserva (fecha y hora)
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
        WHERE id = @id AND estado != 'aprobado'
      `);

    res.json({ message: 'Reserva actualizada' });

  } catch (err) {
    console.error('Error al actualizar reserva:', err);
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
});

// Eliminar reserva
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

module.exports = router;
