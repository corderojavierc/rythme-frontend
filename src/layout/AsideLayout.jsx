import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useTheme } from "../hooks/useTheme";
import "../App.css";

export default function AsideLayout() {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();
    const [showLogout, setShowLogout] = useState(false);

    const currentPath = location.pathname;

    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : {};

    let fullName = "";
    if (user.name && user.second_name) {
        fullName = user.name + " " + user.second_name;
    } else if (user.name) {
        fullName = user.name;
    } else if (user.username) {
        fullName = user.username;
    } else {
        fullName = "Usuario";
    }

    let initials = "";
    if (user.name) {
        initials += user.name[0];
    }
    if (user.second_name) {
        initials += user.second_name[0];
    }
    initials = initials.toUpperCase();
    if (initials === "") {
        initials = "?";
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            auth.setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    function getLinkClass(path) {
        if (currentPath === path) {
            return "nav-item active";
        }
        return "nav-item";
    }

    let chevronIcon = "expand_more";
    if (showLogout) {
        chevronIcon = "expand_less";
    }

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

            <Link className={getLinkClass("/")} to="/">
                <span className="material-symbols-outlined">home</span>
                Feed
            </Link>
            <Link className={getLinkClass("/followed")} to="/followed">
                <span className="material-symbols-outlined">group</span>
                Seguidos
            </Link>
            <Link className={getLinkClass("/rate")} to="/rate">
                <span className="material-symbols-outlined">add_ad</span>
                Valorar
            </Link>
            <Link className={getLinkClass("/music")} to="/music">
                <span className="material-symbols-outlined">music_note_2</span>
                Música
            </Link>
            <Link className={getLinkClass("/events")} to="/events">
                <span className="material-symbols-outlined">
                    calendar_today
                </span>
                Eventos
            </Link>
            <Link className={getLinkClass("/request")} to="/request">
                <span className="material-symbols-outlined">pan_tool_alt</span>
                Solicitar
            </Link>
            <Link className={getLinkClass("/profile")} to="/profile">
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
                    {chevronIcon}
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
