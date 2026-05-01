import { useNavigate } from "react-router-dom";

export default function ApplicationSent() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Volver"
          onClick={() => navigate("/")}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">Solicitud enviada</h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined wip-icon">
            mark_email_read
          </span>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">¡Solicitud recibida!</h1>
          <p className="wip-text">
            Tu solicitud está siendo revisada por el equipo de{" "}
            <strong>RythMe</strong>. Te notificaremos cuando tengamos una
            respuesta.
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
