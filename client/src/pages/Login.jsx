import React from 'react';

const Login = () => {
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
        <button type="submit">Registarse</button>
      </form>
    </div>
  );
};

export default Login;
