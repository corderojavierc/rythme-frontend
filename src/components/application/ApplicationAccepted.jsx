import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ApplicationAccepted() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  let translatedType = user?.type || "";
  if (user?.type === "artist") translatedType = "artista";
  if (user?.type === "creator") translatedType = "creador";
  if (user?.type === "admin") translatedType = "administrador";

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Volver"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">Cuenta verificada</h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span
            className={`material-symbols-outlined verified-${user.type}`}
            style={{
              fontSize: "120px",
              fontVariationSettings: '"FILL" 1',
            }}
          >
            verified
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">
            ¡Felicidades, ya eres parte de la comunidad!
          </h1>
          <p className="wip-text">
            Tu solicitud ha sido <strong>aprobada con éxito</strong>. Ahora
            tienes acceso a todas las herramientas exclusivas para{" "}
            {translatedType} en <strong>RythMe</strong>.
          </p>
        </div>
        <button className="action-btn wip-button" onClick={() => navigate("/")}>
          <span className="material-symbols-outlined">home</span>
          Volver al Feed
        </button>
      </div>
    </>
  );
}
