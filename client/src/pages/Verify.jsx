// src/pages/Verify.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
//import '../styles/Verify.css';

const Verify = () => {
  const [mensaje, setMensaje] = useState('Verificando cuenta...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMensaje('❌ Token no proporcionado');
      return;
    }

    axios.get(`http://localhost:3001/api/auth/verify?token=${token}`)
      .then(res => {
        setMensaje(res.data.message || '✅ Verificado correctamente');
        setTimeout(() => navigate('/login'), 2500);
      })
      .catch(err => {
        setMensaje(err.response?.data?.message || '❌ Error al verificar cuenta');
      });
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <h2>{mensaje}</h2>
    </div>
  );
};

export default Verify;
