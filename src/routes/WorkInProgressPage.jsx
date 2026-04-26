import { useNavigate } from "react-router-dom";

export default function WorkInProgressPage() {
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
        <h2 className="feed-header music-page-title">En construcción</h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined wip-icon">
            construction
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">Sección bajo construcción</h1>
          <p className="wip-text">
            Esta sección de <strong>RythMe</strong> aún está en desarrollo.
            Vuelve pronto para descubrir nuevas formas de vivir la música.
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
