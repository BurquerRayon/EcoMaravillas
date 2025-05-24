const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { poolConnect, pool } = require('./db/connection');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test-db', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT GETDATE() AS now');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error en la base de datos' });
  }
});

app.use('/api/auth', authRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
