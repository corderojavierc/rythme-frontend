// Página de inicio de sesión. Al hacer login correctamente guarda el token y el usuario
// en localStorage y marca la sesión como activa en AuthProvider.
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoginLayout from "../layout/LoginLayout";
import { useState } from "react";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";

const API_URL = getApi() + "/login";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message ? data.message : "Login error";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Guardamos token y usuario para que getAuthHeaders() y getUser() funcionen en toda la app.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      auth.setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials");
      setIsLoading(false);
    }
  };

  if (auth.isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <LoaderScreen text="Cargando..." />;
  }

  return (
    <LoginLayout
      title={
        <>
          <span className="blue">Iniciar</span>
          <span className="pink"> sesión</span>
        </>
      }
      linkText="¿No tienes cuenta?"
      linkHref="/register"
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="btn">
          Iniciar sesión
        </button>
      </form>
    </LoginLayout>
  );
}
