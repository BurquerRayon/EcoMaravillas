const express = require('express');
const cors = require('cors');
const { poolConnect, pool } = require('./db/connection');
const authRoutes = require('./routes/authRoutes');
const reservasRoutes = require('./routes/reservasRoutes'); // ✅ agregar esta línea
const atraccionesRoutes = require('./routes/atraccionesRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Prueba de conexión a la BD
app.get('/api/test-db', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT GETDATE() AS fecha');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    res.status(500).send('Fallo de conexión');
  }
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/atracciones', atraccionesRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));


