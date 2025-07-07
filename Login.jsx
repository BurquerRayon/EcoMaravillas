import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import VerifyModal from "./VerifyModal"; // Opcional, si usas modal

// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      setMensaje("❌ Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          correo,
          contrasena,
        }
      );

      if (response.data.success) {
        const { token, user: responseUser } = response.data;
        const userData = {
          id_usuario: responseUser.id,
          id_turista: responseUser.id_turista,
          correo: responseUser.email,
          nombre: responseUser.nombre,
          rol: responseUser.rol,
          especialidad: responseUser.especialidad,
          verificado: responseUser.verificado,
        };

        login(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        const rol = responseUser.rol?.toLowerCase();
        const esp = responseUser.especialidad?.toLowerCase();

        if (rol === "administrador") {
          navigate("/home/admin");
        } else if (rol === "cliente") {
          navigate("/home/client");
        } else if (rol === "empleado") {
          if (esp === "mantenimiento") {
            navigate("/Employee/PersonalMantenimiento");
          } else if (esp === "guia_turistico") {
            navigate("/Employee/GuiaHome");
          } else if (esp === "contable") {
            navigate("/Employee/Contabilidad");
          } else {
            navigate("/home/employee");
          }
        } else {
          navigate("/");
        }
      } else {
        setMensaje(response.data.message || "❌ Error en inicio de sesión");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setUserEmail(correo);
        setShowVerifyModal(true);
      } else {
        setMensaje(err.response?.data?.message || "❌ Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerifyModal(false);
    setMensaje("✅ Correo verificado. Por favor inicia sesión nuevamente.");
  };

  return (
    <div className="page-wrapper">
      <main className="content">
        <div className="form-container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </main>

      {showVerifyModal && (
        <VerifyModal
          email={userEmail}
          onSuccess={handleVerificationSuccess}
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Login;
