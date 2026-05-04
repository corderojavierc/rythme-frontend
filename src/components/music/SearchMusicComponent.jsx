import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MusicCardComponent from "./MusicCardComponent";
import LoaderScreen from "../LoaderScreen";
import { getApi } from "../../config";

export default function SearchMusicComponent({ onSelect }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

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
        const token = localStorage.getItem("token");
        const response = await fetch(getApi() + "/music/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
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

  const handleSongClick = async (song) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    let selectedSong = song;

    try {
      const token = localStorage.getItem("token");
      const songIsExternal = !Number.isInteger(song.id);

      if (songIsExternal) {
        const response = await fetch(getApi() + "/music", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: song.title + " " + song.artist,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          selectedSong = data.data;
        }
      }

      if (onSelect) {
        onSelect(selectedSong);
      } else {
        navigate("/rate", { state: { selectedMusic: selectedSong } });
      }
    } catch (error) {
      console.error("Error al procesar la canción:", error);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const showPanel =
    (loading || isProcessing || results.length > 0 || message) &&
    query.trim().length >= 2;

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
          disabled={isProcessing}
        />
        <span className="material-symbols-outlined search-icon">search</span>
      </div>

      {showPanel && (
        <div className="search-results-panel">
          {isProcessing && (
            <LoaderScreen inline small text="Verificando canción..." />
          )}

          {!isProcessing && loading && (
            <div className="search-status-inline">
              <span className="material-symbols-outlined rotating">
                refresh
              </span>
              Buscando en la biblioteca...
            </div>
          )}

          {!isProcessing && !loading && message && (
            <div className="search-status-inline external">
              <span className="material-symbols-outlined">language</span>
              {message}
            </div>
          )}

          {!isProcessing && (
            <div className="music-results-list">
              {results.map((song, index) => (
                <MusicCardComponent
                  key={song.id || index}
                  music={song}
                  onClick={handleSongClick}
                />
              ))}
            </div>
          )}

          {!isProcessing && !loading && results.length === 0 && (
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
