// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envía un correo de verificación al usuario
 * @param {string} to - Correo del destinatario
 * @param {string} token - Token único
 * @param {string} nombre - Nombre del usuario
 */
const sendVerificationEmail = async (to, token, nombre) => {
  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"EcoMaravillas" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verifica tu cuenta en EcoMaravillas',
    html: `
      <h2>Hola ${nombre},</h2>
      <p>Gracias por registrarte en EcoMaravillas.</p>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${verificationLink}" target="_blank">Verificar cuenta</a>
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
