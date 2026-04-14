import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "../App.css";

export default function AsideLayout() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();
    const [showLogout, setShowLogout] = useState(false);

    const webLocation = window.location.pathname;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const fullName =
        user.name && user.second_name
            ? `${user.name} ${user.second_name}`
            : user.name || user.username || "Usuario";
    const initials =
        `${user.name?.[0] || ""}${user.second_name?.[0] || ""}`.toUpperCase() ||
        "?";

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
            localStorage.removeItem("user");
            auth.setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <aside className="sidebar">
            <Link className="brand-link" to="/">
                <div className="logo">
                    <img
                        src="/logo-removebg-preview-effect.png"
                        alt="Logo RythMe"
                    />
                </div>
                <div className="brand-text">
                    <span className="blue">Ryth</span>
                    <span className="pink">Me</span>
                </div>
            </Link>

            <Link
                className={`nav-item ${webLocation === "/" ? "active" : ""}`}
                to="/"
            >
                <span className="material-symbols-outlined">home</span>
                Feed
            </Link>
            <Link
                className={`nav-item ${webLocation === "/followed" ? "active" : ""}`}
                to="/followed"
            >
                <span className="material-symbols-outlined">group</span>
                Seguidos
            </Link>
            <Link
                className={`nav-item ${webLocation === "/rate" ? "active" : ""}`}
                to="/rate"
            >
                <span className="material-symbols-outlined">add_ad</span>
                Valorar
            </Link>
            <Link
                className={`nav-item ${webLocation === "/search" ? "active" : ""}`}
                to="/search"
            >
                <span className="material-symbols-outlined">search</span>
                Búscar
            </Link>
            <Link
                className={`nav-item ${webLocation === "/events" ? "active" : ""}`}
                to="/events"
            >
                <span className="material-symbols-outlined">
                    calendar_today
                </span>
                Eventos
            </Link>
            <Link
                className={`nav-item ${webLocation === "/request" ? "active" : ""}`}
                to="/request"
            >
                <span className="material-symbols-outlined">pan_tool_alt</span>
                Solicitar
            </Link>
            <Link
                className={`nav-item ${webLocation === "/profile" ? "active" : ""}`}
                to="/profile"
            >
                <span className="material-symbols-outlined">person</span>
                Perfil
            </Link>

            <div className="nav-spacer"></div>

            <div
                className="user-card"
                onClick={() => setShowLogout((prev) => !prev)}
            >
                <div className="user-card-avatar">
                    {user.profile_image ? (
                        <img src={user.profile_image} alt={fullName} />
                    ) : (
                        initials
                    )}
                </div>
                <div className="user-card-info">
                    <div className="user-card-name">{fullName}</div>
                    <div className="user-card-handle">
                        @{user.username || "usuario"}
                    </div>
                </div>
                <span className="material-symbols-outlined user-card-chevron">
                    {showLogout ? "expand_less" : "expand_more"}
                </span>
            </div>

            {showLogout && (
                <button
                    onClick={handleLogout}
                    className="nav-item action-btn logout-btn"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar sesión
                </button>
            )}

            <button className="theme-toggle" onClick={toggleTheme}>
                Cambiar tema
            </button>
        </aside>
    );
}
