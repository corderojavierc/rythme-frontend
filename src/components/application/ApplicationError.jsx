import { useNavigate } from "react-router-dom";

export default function ApplicationVerified() {
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
        <h2 className="feed-header music-page-title">Cuenta verificada</h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span
            className="material-symbols-outlined wip-icon"
            style={{ color: "#22c55e" }}
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
            tienes acceso a todas las herramientas exclusivas para artistas y
            creadores en <strong>RythMe</strong>.
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
