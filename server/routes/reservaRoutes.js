const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Crear una nueva reserva
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

// Obtener historial de reservas por id_turista
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

module.exports = router;
