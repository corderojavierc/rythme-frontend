import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoginLayout from "../layout/loginLayout";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return <Navigate to="/" />;
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
            <form>
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

                <button type="submit" className="btn">
                    Iniciar sesión
                </button>
            </form>
        </LoginLayout>
    );
}
