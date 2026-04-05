import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoginLayout from "../layout/loginLayout";
import { useState } from "react";
import LoaderScreen from "../components/LoaderScreen";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();

    if (auth.isAuthenticated && !isLoading) {
        return <Navigate to="/" replace />;
    }

    if (isLoading) {
        return <LoaderScreen text="Cargando..." />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

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

            if (!response.ok) {
                setError(data.message || "Login failed");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            auth.setIsAuthenticated(true);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Server connection error");
            setIsLoading(false);
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
