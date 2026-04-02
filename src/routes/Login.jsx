import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoginLayout from "../layout/loginLayout";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    // Si ya está autenticado, redirige
    if (auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            console.log("STATUS:", response.status);
            console.log("RESPONSE:", data);

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);

            auth.setIsAuthenticated(true);

            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Server error");
        }
    };

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

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" className="btn">
                    Iniciar sesión
                </button>
            </form>
        </LoginLayout>
    );
}
