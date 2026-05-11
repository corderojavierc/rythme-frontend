import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicCardComponent from "./MusicCardComponent";
import { getApi, getAuthHeaders } from "../../config";

export default function SearchMusicComponent({ onSelect }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setMessage("");
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(getApi() + "/music/search", {
          method: "POST",
          headers: getAuthHeaders("application/json"),
          body: JSON.stringify({ name: query, limit: 5 }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults((data.data || []).slice(0, 5));
        setMessage(data.message || "");
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error searching music:", error);
          setResults([]);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSongClick = (song) => {
    if (onSelect) {
      onSelect(song);
    } else {
      navigate("/rate", { state: { selectedMusic: song } });
    }
  };

  const showPanel =
    (loading || results.length > 0 || message) && query.trim().length >= 2;

  return (
    <div
      className={`music-search-integrated${showPanel ? " has-content" : ""}`}
    >
      <div className="search-group">
        <input
          type="text"
          placeholder="Busca artistas, canciones..."
          className="rythme-search-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="material-symbols-outlined search-icon">search</span>
      </div>

      {showPanel && (
        <div className="search-results-panel">
          {!loading && message && (
            <div className="search-status-inline external">
              <span className="material-symbols-outlined">language</span>
              {message}
            </div>
          )}

          {loading && (
            <div className="search-status-inline">
              <span className="material-symbols-outlined rotating">
                refresh
              </span>
              Buscando en la biblioteca...
            </div>
          )}

          <div className="music-results-list">
            {results.map((song, index) => (
              <MusicCardComponent
                key={song.id || index}
                music={song}
                onClick={handleSongClick}
              />
            ))}
          </div>

          {!loading && results.length === 0 && (
            <div className="no-music-found-inline">
              <span className="material-symbols-outlined">search_off</span>
              No se han encontrado coincidencias
            </div>
          )}
        </div>
      )}
    </div>
  );
}
