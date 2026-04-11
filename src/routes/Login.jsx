import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoginLayout from "../layout/loginLayout";
import { useState } from "react";
import LoaderScreen from "../components/LoaderScreen";

const API_URL = "http://localhost:8000/api/login";

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
        console.log("login response:", data);

        if (response.ok == false) {
            setError(data.message ? data.message : "Login failed");
            setIsLoading(false);
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        auth.setIsAuthenticated(true);
        navigate("/");
    };

    if (auth.isAuthenticated == true && isLoading == false) {
        return <Navigate to="/" replace />;
    }

    if (isLoading == true) {
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
                {error != "" && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className="btn">
                    Iniciar sesión
                </button>
            </form>
        </LoginLayout>
    );
}
