// server/index.js
const express = require('express');
const cors = require('cors');
const { poolConnect, pool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT GETDATE() AS currentTime');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error ejecutando consulta:', err);
    res.status(500).send('Error en el servidor');
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
