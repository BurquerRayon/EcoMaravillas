const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// ============================
// Crear una nueva reserva
// ============================
router.post('/', async (req, res) => {
  const { id_turista, detalles } = req.body;

  if (!id_turista || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Faltan datos de la reserva o detalles' });
  }

  try {
    await poolConnect;

    // Calcular total estimado
    const totalEstimado = detalles.reduce((total, d) => {
      const cantidad = parseInt(d.cantidad) || 0;
      const tarifa = parseFloat(d.tarifa_unitaria) || 0;
      return total + (cantidad * tarifa);
    }, 0);

    // Insertar reserva principal
    const reservaResult = await pool.request()
      .input('id_turista', id_turista)
      .input('total_pago_estimado', totalEstimado)
      .query(`
        INSERT INTO Reservas (id_turista, total_pago_estimado)
        OUTPUT INSERTED.id_reserva
        VALUES (@id_turista, @total_pago_estimado)
      `);

    const id_reserva = reservaResult.recordset[0].id_reserva;

    // Insertar detalles
    for (const detalle of detalles) {
      const { id_atraccion, cantidad, tarifa_unitaria, fecha, hora } = detalle;
      const subtotal = cantidad * tarifa_unitaria;

      console.log('Insertando detalle:', {
        id_reserva,
        id_atraccion,
        cantidad,
        tarifa_unitaria,
        fecha,
        hora,
        subtotal
      });
      
      await pool.request()
        .input('id_reserva', id_reserva)
        .input('id_atraccion', id_atraccion)
        .input('cantidad', cantidad)
        .input('tarifa_unitaria', tarifa_unitaria)
        .input('fecha', fecha)
        .input('hora', hora)
        .input('subtotal', subtotal)
        .query(`
          INSERT INTO Reserva_Detalles 
          (id_reserva, id_atraccion, cantidad, tarifa_unitaria, fecha, hora, subtotal)
          VALUES 
          (@id_reserva, @id_atraccion, @cantidad, @tarifa_unitaria, @fecha, @hora, @subtotal)
        `);
    }

    res.status(201).json({ message: 'Reserva registrada con éxito' });

  } catch (err) {
    console.error('Error al guardar la reserva:', err);
    res.status(500).json({ message: 'Error interno al guardar la reserva' });
  }
});

// =============================================
// Obtener historial de reservas por id_turista
// =============================================
router.get('/turista/:id_turista', async (req, res) => {
  const { id_turista } = req.params;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('id_turista', id_turista)
.query(`
  SELECT 
    R.id_reserva,
    D.fecha,
    D.hora,
    A.nombre AS nombre_atraccion,
    D.cantidad,
    D.subtotal,
    R.estado
  FROM Reservas R
  JOIN Reserva_Detalles D ON R.id_reserva = D.id_reserva
  JOIN Atraccion A ON D.id_atraccion = A.id_atraccion
  WHERE R.id_turista = @id_turista
  ORDER BY D.fecha DESC, D.hora ASC
`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener reservas del turista:', err);
    res.status(500).json({ message: 'Error al obtener historial de reservas' });
  }
});

//======================================================================
// Obtener todas las reservas con detalles y nombre del cliente
//======================================================================
router.get('/admin', async (req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT 
        R.id_reserva,
        P.nombre + ' ' + P.apellido AS nombre_cliente,
        D.fecha,
        D.hora,
        A.nombre AS nombre_atraccion,
        D.cantidad,
        D.subtotal,
        R.estado
      FROM Reservas R
      JOIN Reserva_Detalles D ON R.id_reserva = D.id_reserva
      JOIN Atraccion A ON D.id_atraccion = A.id_atraccion
      JOIN Turista T ON R.id_turista = T.id_turista
      JOIN Usuario U ON T.id_usuario = U.id_usuario
      JOIN Persona P ON U.id_persona = P.id_persona
      ORDER BY D.fecha DESC, D.hora ASC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener reservas (admin):', err);
    res.status(500).json({ message: 'Error al obtener las reservas del sistema' });
  }
});

// ===============================
// Cambiar estado de una reserva
// ===============================
router.put('/estado/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['pendiente', 'confirmado', 'cancelado'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('id_reserva', id)
      .input('estado', estado)
      .query(`
        UPDATE Reservas
        SET estado = @estado
        WHERE id_reserva = @id_reserva
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: `Estado de la reserva actualizado a "${estado}"` });
  } catch (err) {
    console.error('Error al actualizar estado de reserva:', err);
    res.status(500).json({ message: 'Error interno al actualizar la reserva' });
  }
});

module.exports = router;
