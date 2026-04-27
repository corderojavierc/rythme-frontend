import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
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
        <h2 className="feed-header music-page-title">Error 404</h2>
      </div>

      <div className="feed-state wip-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined wip-icon">search_off</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="wip-title">Página no encontrada</h1>
          <p className="wip-text">
            Parece que el ritmo te ha llevado a un lugar que no existe. La
            página que buscas no se encuentra en nuestro catálogo.
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
