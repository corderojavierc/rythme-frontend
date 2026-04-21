import LoginLayout from "../layout/LoginLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { getApi } from "../config";
import LoaderScreen from "../components/LoaderScreen";

const API_URL = getApi() + "/register";

export default function Register() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            setError("The passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    second_name: secondName,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirm,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message
                    ? data.message
                    : "Register error";
                setError(errorMessage);
                setIsLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            auth.setIsAuthenticated(true);
            navigate("/");
        } catch (err) {
            console.error("Register error:", err);
            setError("Server error");
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
                    <span className="blue">Registrar</span>
                    <span className="pink">me</span>
                </>
            }
            linkText="¿Ya tienes cuenta?"
            linkHref="/login"
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
                    type="text"
                    placeholder="Nombre"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    required
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Repetir contraseña"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                {error !== "" && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" className="btn">
                    Registrarme
                </button>
            </form>
        </LoginLayout>
    );
}
