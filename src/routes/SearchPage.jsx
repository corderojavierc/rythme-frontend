// Página de resultados de búsqueda. La query viene en ?q= para que sea enlazable.
// Sin query (acceso desde navbar móvil) muestra un formulario de búsqueda.
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchNavigationComponent from "../components/search/SearchNavigationComponent";
import SearchMusicsComponent from "../components/search/SearchMusicsComponent";
import SearchPostsComponent from "../components/search/SearchPostsComponent";
import SearchUsersComponent from "../components/search/SearchUsersComponent";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("musics");

  const query = searchParams.get("q");

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.q.value.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  if (!query) {
    return (
      <div>
        <h2 className="feed-header">Buscar</h2>
        <form onSubmit={handleSearch} className="search-page-form">
          <div className="search-group">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              name="q"
              autoFocus
              className="rythme-search-field"
              placeholder="Artistas, canciones, usuarios..."
            />
          </div>
        </form>
        <div className="feed-state" style={{ marginTop: "48px" }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "48px", color: "var(--text-muted)", opacity: 0.4 }}
          >
            travel_explore
          </span>
          Escribe algo para empezar a buscar
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Volver"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">"{query}"</h2>
      </div>
      <SearchNavigationComponent
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="profile-content-area">
        {activeTab === "musics" && <SearchMusicsComponent query={query} />}
        {activeTab === "posts" && <SearchPostsComponent query={query} />}
        {activeTab === "users" && <SearchUsersComponent query={query} />}
      </div>
    </div>
  );
}
