import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function App() {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token");

            auth.setIsAuthenticated(false);

            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h1>Pantalla de App</h1>

            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}
