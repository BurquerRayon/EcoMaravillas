const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');
const sql = require('mssql'); // Añade esta línea al inicio con las otras importaciones

// 🔧 Función auxiliar para obtener el bloque horario (ej: 09:00 -> '09:00 - 09:30')
function obtenerBloqueHorario(hora) {
  const [h, m] = hora.split(':').map(Number);
  const inicio = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  const finDate = new Date(0, 0, 0, h, m + 30);
  const fin = `${finDate.getHours().toString().padStart(2, '0')}:${finDate.getMinutes().toString().padStart(2, '0')}`;
  return `${inicio} - ${fin}`;
}

// ============================
// POST /crear - Crear nueva reserva con validaciones
// ============================
router.post('/crear', async (req, res) => {
  const { id_turista, detalles } = req.body;

  if (!id_turista || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Faltan datos de la reserva o detalles' });
  }

  try {
    await poolConnect;

    // Validar cada detalle individualmente antes de insertar
    for (const detalle of detalles) {
      const { id_atraccion, cantidad, fecha, hora } = detalle;

      if (!id_atraccion || !cantidad || !fecha || !hora) {
        return res.status(400).json({ message: 'Datos incompletos en detalles de la reserva' });
      }

// Verificar si ya existe una reserva del mismo turista para la misma atracción, fecha y hora
      const reservaDuplicada = await pool.request()
        .input('id_turista', id_turista)
        .input('id_atraccion', id_atraccion)
        .input('fecha', fecha)
        .input('hora', hora)
        .query(`
          SELECT COUNT(*) as total
          FROM Reserva_Detalles RD
          INNER JOIN Reservas R ON RD.id_reserva = R.id_reserva
          WHERE R.id_turista = @id_turista
            AND RD.id_atraccion = @id_atraccion
            AND RD.fecha = @fecha
            AND RD.hora = @hora
            AND R.estado IN ('pendiente', 'confirmado')
        `);

      if (reservaDuplicada.recordset[0].total > 0) {
        const atraccionNombre = await pool.request()
          .input('id_atraccion', id_atraccion)
          .query('SELECT nombre FROM Atraccion WHERE id_atraccion = @id_atraccion');
        
        const nombreAtraccion = atraccionNombre.recordset[0]?.nombre || 'Atracción';
        const bloqueHorario = obtenerBloqueHorario(hora);
        
        return res.status(400).json({
          message: `❌ Ya tienes una reserva para "${nombreAtraccion}" el ${fecha} en el horario ${bloqueHorario}. No puedes crear reservas duplicadas.`
        });
      }

      // Obtener capacidad máxima de la atracción
      const atraccionRes = await pool.request()
        .input('id_atraccion', id_atraccion)
        .query(`
          SELECT max_personas FROM Atraccion WHERE id_atraccion = @id_atraccion
        `);

      if (atraccionRes.recordset.length === 0) {
        return res.status(404).json({ message: 'Atracción no encontrada' });
      }

      const maxPersonas = atraccionRes.recordset[0].max_personas;

      // Calcular bloque horario
      const bloqueHorario = obtenerBloqueHorario(hora);

      // Consultar total de personas ya registradas en ese bloque para la atracción
      const reservasEnBloque = await pool.request()
        .input('id_atraccion', id_atraccion)
        .input('fecha', fecha)
        .input('hora', hora)
        .query(`
          SELECT SUM(RD.cantidad) AS total_reservado
          FROM Reserva_Detalles RD
          INNER JOIN Reservas R ON RD.id_reserva = R.id_reserva
          WHERE RD.id_atraccion = @id_atraccion
            AND RD.fecha = @fecha
            AND RD.hora = @hora
            AND R.estado IN ('pendiente', 'confirmado')
        `);

      const totalActual = reservasEnBloque.recordset[0].total_reservado || 0;
      const totalFinal = totalActual + cantidad;

      if (totalFinal > maxPersonas) {
        return res.status(400).json({
          message: `❌ El bloque horario "${bloqueHorario}" ya tiene ${totalActual} personas reservadas. ` +
                   `La atracción permite un máximo de ${maxPersonas}. Reduce la cantidad o elige otro horario.`
        });
      }
    }

    // Calcular total estimado
    const totalEstimado = detalles.reduce((sum, d) => sum + (d.cantidad * d.tarifa_unitaria), 0);

    // Insertar reserva principal
    const reservaInsert = await pool.request()
      .input('id_turista', id_turista)
      .input('total_pago_estimado', totalEstimado)
      .query(`
        INSERT INTO Reservas (id_turista, total_pago_estimado)
        OUTPUT INSERTED.id_reserva
        VALUES (@id_turista, @total_pago_estimado)
      `);

    const id_reserva = reservaInsert.recordset[0].id_reserva;

    // Insertar detalles de la reserva
    for (const detalle of detalles) {
      const { id_atraccion, cantidad, tarifa_unitaria, fecha, hora } = detalle;
      const subtotal = cantidad * tarifa_unitaria;

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
          VALUES (@id_reserva, @id_atraccion, @cantidad, @tarifa_unitaria, @fecha, @hora, @subtotal)
        `);
    }

    res.status(201).json({ });

  } catch (err) {
    console.error('Error al registrar reserva:', err);
    res.status(500).json({ message: '❌ Error interno al guardar la reserva' });
  }
});

// ============================
// Actualizar una reserva existente
// ============================
router.put('/editar/:id_reserva', async (req, res) => {
  const { id_reserva } = req.params;
  const { id_turista, detalles } = req.body;

  if (!id_turista || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Datos incompletos para la edición' });
  }

  try {
    await poolConnect;

    // 1. Verificar que la reserva existe y pertenece al turista
    const reservaCheck = await pool.request()
      .input('id_reserva', id_reserva)
      .input('id_turista', id_turista)
      .query(`
        SELECT estado, ediciones 
        FROM Reservas 
        WHERE id_reserva = @id_reserva 
          AND id_turista = @id_turista
      `);
    
    if (reservaCheck.recordset.length === 0) {
      return res.status(404).json({ 
        message: 'Reserva no encontrada o no pertenece al usuario' 
      });
    }

    const { estado, ediciones } = reservaCheck.recordset[0];

    // 2. Validar límites de edición según estado
    if (estado === 'cancelado') {
      return res.status(400).json({ 
        message: 'No se pueden editar reservas canceladas' 
      });
    }

    if (estado === 'confirmado' && ediciones >= 1) {
      return res.status(400).json({ 
        message: 'Solo puedes editar 1 vez las reservas confirmadas' 
      });
    }

    if (estado === 'pendiente' && ediciones >= 2) {
      return res.status(400).json({ 
        message: 'Solo puedes editar máximo 2 veces las reservas pendientes' 
      });
    }

    // 3. Validar disponibilidad en los nuevos horarios
    for (const detalle of detalles) {
      const { id_atraccion, cantidad, fecha, hora } = detalle;

      if (!id_atraccion || !cantidad || !fecha || !hora) {
        return res.status(400).json({ 
          message: 'Todos los campos son requeridos en cada detalle' 
        });
      }

      // Obtener capacidad máxima
      const atraccionRes = await pool.request()
        .input('id_atraccion', id_atraccion)
        .query('SELECT max_personas FROM Atraccion WHERE id_atraccion = @id_atraccion');

      if (atraccionRes.recordset.length === 0) {
        return res.status(404).json({ message: 'Atracción no encontrada' });
      }

      const maxPersonas = atraccionRes.recordset[0].max_personas;
      const bloqueHorario = obtenerBloqueHorario(hora);

      // Consultar disponibilidad (excluyendo esta reserva)
      const disponibilidadRes = await pool.request()
        .input('id_atraccion', id_atraccion)
        .input('fecha', fecha)
        .input('hora', hora)
        .input('id_reserva', id_reserva)
        .query(`
          SELECT SUM(RD.cantidad) AS total_reservado
          FROM Reserva_Detalles RD
          INNER JOIN Reservas R ON RD.id_reserva = R.id_reserva
          WHERE RD.id_atraccion = @id_atraccion
            AND RD.fecha = @fecha
            AND RD.hora = @hora
            AND R.id_reserva != @id_reserva
            AND R.estado IN ('pendiente', 'confirmado')
        `);

      const totalActual = disponibilidadRes.recordset[0].total_reservado || 0;
      const totalFinal = totalActual + cantidad;

      if (totalFinal > maxPersonas) {
        return res.status(400).json({
          message: `El bloque horario "${bloqueHorario}" ya tiene ${totalActual} personas reservadas. ` +
                   `La atracción permite un máximo de ${maxPersonas}. Reduce la cantidad o elige otro horario.`
        });
      }
    }

    // 4. Usar transacción con el pool existente
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // 5. Eliminar detalles existentes (nueva instancia de Request)
      const deleteRequest = transaction.request();
      await deleteRequest
        .input('id_reserva', id_reserva)
        .query('DELETE FROM Reserva_Detalles WHERE id_reserva = @id_reserva');

      // 6. Insertar nuevos detalles y calcular nuevo total
      let totalNuevo = 0;
      for (const detalle of detalles) {
        const subtotal = detalle.cantidad * detalle.tarifa_unitaria;
        totalNuevo += subtotal;

        // Nueva instancia de Request para cada inserción
        const insertRequest = transaction.request();
        await insertRequest
          .input('id_reserva', id_reserva)
          .input('id_atraccion', detalle.id_atraccion)
          .input('cantidad', detalle.cantidad)
          .input('tarifa_unitaria', detalle.tarifa_unitaria)
          .input('fecha', detalle.fecha)
          .input('hora', detalle.hora)
          .input('subtotal', subtotal)
          .query(`
            INSERT INTO Reserva_Detalles
            (id_reserva, id_atraccion, cantidad, tarifa_unitaria, fecha, hora, subtotal)
            VALUES
            (@id_reserva, @id_atraccion, @cantidad, @tarifa_unitaria, @fecha, @hora, @subtotal)
          `);
      }

      // 7. Actualizar reserva (nueva instancia de Request)
      const updateRequest = transaction.request();
      await updateRequest
        .input('id_reserva', id_reserva)
        .input('total_pago_estimado', totalNuevo)
        .input('ediciones', ediciones + 1)
        .query(`
          UPDATE Reservas 
          SET total_pago_estimado = @total_pago_estimado, 
              ediciones = @ediciones 
          WHERE id_reserva = @id_reserva
        `);

      await transaction.commit();
      res.json({ message: '✅ Reserva actualizada correctamente' });

    } catch (err) {
      await transaction.rollback();
      console.error('Error en transacción:', err);
      throw err;
    }

  } catch (err) {
    console.error('Error al actualizar reserva:', err);
    res.status(500).json({ 
      message: '❌ Error interno al actualizar la reserva',
      error: err.message 
    });
  }
});

// ============================
// Ruta para cancelar reserva
// ============================
router.put('/cancelar/:id_reserva', async (req, res) => {
  const { id_reserva } = req.params;
  
  try {
    await poolConnect;
    
    // Verificar si la reserva existe y no está ya cancelada
    const reservaCheck = await pool.request()
      .input('id_reserva', id_reserva)
      .query('SELECT estado FROM Reservas WHERE id_reserva = @id_reserva');
    
    if (reservaCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    if (reservaCheck.recordset[0].estado === 'cancelado') {
      return res.status(400).json({ message: 'La reserva ya está cancelada' });
    }
    
    // Actualizar estado a cancelado
    const result = await pool.request()
      .input('id_reserva', id_reserva)
      .query('UPDATE Reservas SET estado = \'cancelado\' WHERE id_reserva = @id_reserva');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(500).json({ message: 'No se pudo cancelar la reserva' });
    }
    
    res.json({ message: '✅ Reserva cancelada exitosamente' });
  } catch (err) {
    console.error('Error al cancelar reserva:', err);
    res.status(500).json({ message: '❌ Error interno al cancelar la reserva' });
  }
});

// Ruta para obtener detalles de una reserva específica
router.get('/:id_reserva/detalles', async (req, res) => {
  const { id_reserva } = req.params;
  
  try {
    await poolConnect;
    
    const result = await pool.request()
      .input('id_reserva', id_reserva)
      .query(`
        SELECT 
          RD.id_atraccion,
          A.nombre AS nombre_atraccion,
          RD.cantidad,
          RD.tarifa_unitaria,
          RD.fecha,
          RD.hora,
          RD.subtotal
        FROM Reserva_Detalles RD
        JOIN Atraccion A ON RD.id_atraccion = A.id_atraccion
        WHERE RD.id_reserva = @id_reserva
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No se encontraron detalles para esta reserva' });
    }
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener detalles de reserva:', err);
    res.status(500).json({ message: 'Error interno al obtener detalles' });
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

// Ruta para obtener información básica de una reserva
router.get('/:id_reserva', async (req, res) => {
  const { id_reserva } = req.params;
  
  try {
    await poolConnect;
    
    const result = await pool.request()
      .input('id_reserva', id_reserva)
      .query(`
        SELECT 
          id_reserva,
          id_turista,
          estado,
          total_pago_estimado,
          ediciones
        FROM Reservas
        WHERE id_reserva = @id_reserva
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).json({ message: 'Error interno al obtener reserva' });
  }
});

// =============================================
// Obtener historial de reservas por id_turista
// =============================================
// Modificar la ruta GET /turista/:id_turista
router.get('/turista/:id_turista', async (req, res) => {
  const { id_turista } = req.params;
  const { completo, fechaDesde, fechaHasta, estado, id_atraccion, atraccion } = req.query;

  try {
    await poolConnect;

    let query = `
      SELECT 
        R.id_reserva,
        D.fecha,
        D.hora,
        A.nombre AS nombre_atraccion,
        D.cantidad,
        D.subtotal,
        R.estado,
        R.ediciones
      FROM Reservas R
      JOIN Reserva_Detalles D ON R.id_reserva = D.id_reserva
      JOIN Atraccion A ON D.id_atraccion = A.id_atraccion
      WHERE R.id_turista = @id_turista
    `;

    // Si no es completo, filtrar solo activas
    if (completo !== 'true') {
      query += ` AND R.estado IN ('pendiente', 'confirmado')`;
    }

    // Aplicar filtros adicionales
    if (fechaDesde) {
      query += ` AND D.fecha >= @fechaDesde`;
    }
    if (fechaHasta) {
      query += ` AND D.fecha <= @fechaHasta`;
    }
    if (estado) {
      query += ` AND R.estado = @estado`;
    }
    // Priorizar el filtro por ID si está presente
    if (id_atraccion) {
      query += ` AND D.id_atraccion = @id_atraccion`;
    } else if (atraccion) {
      query += ` AND A.nombre LIKE '%' + @atraccion + '%'`;
    }

    query += ` ORDER BY D.fecha DESC, D.hora ASC`;

    const request = pool.request()
      .input('id_turista', id_turista);

    if (fechaDesde) request.input('fechaDesde', fechaDesde);
    if (fechaHasta) request.input('fechaHasta', fechaHasta);
    if (estado) request.input('estado', estado);
    if (id_atraccion) request.input('id_atraccion', id_atraccion);
    if (atraccion && !id_atraccion) request.input('atraccion', atraccion);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener reservas del turista:', err);
    res.status(500).json({ message: 'Error al obtener historial de reservas' });
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
