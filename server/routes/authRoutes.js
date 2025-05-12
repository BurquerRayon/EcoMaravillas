const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;

  try {
    await poolConnect;

    const check = await pool.request()
      .input('correo', correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('contrasena', hashedPassword)
      .input('rol', rol || 'cliente')
      .query(`
        INSERT INTO Usuarios (nombre, correo, contrasena, rol)
        VALUES (@nombre, @correo, @contrasena, @rol)
      `);

    res.json({ message: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('correo', correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.recordset[0];
    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    delete usuario.contrasena;
    res.json({ message: 'Login exitoso', user: usuario });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
