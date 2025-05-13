const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener todas las atracciones activas
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .query('SELECT * FROM Atracciones WHERE estado = \'activo\'');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener atracciones:', err);
    res.status(500).json({ message: 'Error al cargar atracciones' });
  }
});

module.exports = router;
