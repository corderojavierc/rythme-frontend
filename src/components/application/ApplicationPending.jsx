import { useNavigate } from "react-router-dom";

export default function ApplicationPending() {
  const navigate = useNavigate();
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
        <h2 className="feed-header music-page-title">
          Solicitud de verificación
        </h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined wip-icon">
            pending_actions
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">¡Ya tienes una solicitud activa!</h1>
          <p className="wip-text">
            Ya tienes un proceso de verificación creado. Por favor, espera a que
            el equipo de <strong>RythMe</strong> revise tu información y te de
            una respuesta.
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
