import LoginLayout from "../layout/loginLayout";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Register() {
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return <Navigate to="/" />;
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
            <form action="/login">
                <input type="text" placeholder="Nombre de usuario" required />

                <input type="text" placeholder="Nombre" required />
                <input type="text" placeholder="Apellido" required />

                <input type="email" placeholder="Correo electrónico" required />

                <input type="password" placeholder="Contraseña" required />
                <input
                    type="password"
                    placeholder="Repetir contraseña"
                    required
                />

                <button type="submit" className="btn">
                    Registrarme
                </button>
            </form>
        </LoginLayout>
    );
}
