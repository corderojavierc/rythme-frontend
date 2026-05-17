// Barra de navegación lateral izquierda. Muestra los links principales y la tarjeta del usuario.
// Se suscribe al evento "userUpdated" (disparado desde ApplicationForm y otros) para refrescar
// el nombre, avatar y tipo de cuenta sin necesidad de recargar la página.
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import VerifiedBadgeComponent from "../components/VerifiedBadgeComponent";
import "../App.css";
import logoImg from "../logo-removebg-preview-effect.png";
import { getApi, getAuthHeaders, getUser } from "../config";

export default function AsideLayout() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const currentPath = location.pathname;

  const [user, setUser] = useState(() => getUser() || {});

  useEffect(() => {
    const handleUserUpdate = () => setUser(getUser() || {});
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  let fullName = user.username || "Usuario";
  if (user.name) {
    fullName = user.name;
  }

  let initials = "?";
  if (user.name) {
    initials = (user.name?.[0] || "").toUpperCase();
  }

  const handleLogout = async () => {
    try {
      await fetch(`${getApi()}/logout`, {
        method: "POST",
        headers: getAuthHeaders("application/json"),
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      auth.setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Marca el link activo comparando con la ruta actual para el resaltado visual del menú.
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

  console.log(user);

  return (
    <aside className="sidebar">
      <Link className="brand-link" to="/">
        <div className="logo">
          <img src={logoImg} alt="Logo RythMe" />
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
      <Link className={getLinkClass("/music")} to="/music">
        <span className="material-symbols-outlined">music_note_2</span>
        Música
      </Link>
      <Link className={getLinkClass("/events")} to="/events">
        <span className="material-symbols-outlined">calendar_today</span>
        Eventos
      </Link>
      {user.type === "user" && (
        <Link className={getLinkClass("/request")} to="/request">
          <span className="material-symbols-outlined">pan_tool_alt</span>
          Solicitar
        </Link>
      )}
      {user.type === "admin" && (
        <Link
          className={getLinkClass("/admin")}
          to="http://localhost:8000/admin"
        >
          <span class="material-symbols-outlined">admin_panel_settings</span>
          Admin
        </Link>
      )}
      <Link
        className={getLinkClass(`/${user.username}`)}
        to={`/${user.username}`}
      >
        <span className="material-symbols-outlined">person</span>
        Perfil
      </Link>

      <div className="nav-spacer"></div>

      <div className="user-card" onClick={() => setShowLogout((prev) => !prev)}>
        <div className="user-card-avatar">
          {user.profile_image ? (
            <img src={user.profile_image} alt={fullName} />
          ) : (
            initials
          )}
        </div>
        <div className="user-card-info">
          <div className="user-card-name">
            {fullName}
            <VerifiedBadgeComponent type={user.type} />
          </div>
          <div className="user-card-handle">@{user.username || "usuario"}</div>
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
    </aside>
  );
}
