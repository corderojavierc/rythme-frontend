import { useNavigate } from "react-router-dom";

export default function ApplicationComponent() {
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
          Programas de Verificación
        </h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined wip-icon">
            forward_to_inbox
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">¿Eres artista o creador de contenido?</h1>
          <p className="wip-text">
            Únete a la comunidad de profesionales en <strong>RythMe</strong> y
            accede a herramientas exclusivas para impulsar tu carrera musical o
            tu contenido.
          </p>
        </div>
        <button
          className="action-btn wip-button"
          onClick={() => navigate("/request/form")}
        >
          <span className="material-symbols-outlined">start</span>
          Empezar solicitud
        </button>
      </div>
    </>
  );
}
