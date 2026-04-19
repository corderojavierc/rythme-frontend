import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MusicCardComponent from "./MusicCardComponent";
import { getApi } from "../../config";

export default function SearchMusicComponent({ onSelect }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMusic = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setMessage("");
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${getApi()}/music/search`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: query }),
                });

                if (!response.ok) throw new Error("Search failed");

                const data = await response.json();
                setResults(data.data || []);
                setMessage(data.message || "");
            } catch (error) {
                console.error("Error searching music:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchMusic, 400);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSongClick = async (song) => {
        setError("");
        let selectedSong = song;

        try {
            const token = localStorage.getItem("token");

            if (!Number.isInteger(song.id)) {
                const response = await fetch(`${getApi()}/music`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: `${song.title} ${song.artist}`,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    selectedSong = data.data;
                }
            }

            const checkResponse = await fetch(
                `${getApi()}/posts/check/${selectedSong.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (checkResponse.ok) {
                const checkData = await checkResponse.json();

                if (checkData.exists) {
                    navigate(location.pathname, {
                        state: { from: "error-song-exists" },
                        replace: true,
                    });
                    return;
                }
            }

            if (onSelect) {
                onSelect(selectedSong);
            } else {
                navigate("/rate", { state: { selectedMusic: selectedSong } });
            }
        } catch (error) {
            console.error("Error al procesar la canción:", error);
        }
    };

    return (
        <div
            className={`music-search-integrated ${results.length > 0 || loading || message ? "has-content" : ""}`}
        >
            <div className="search-group">
                <input
                    type="text"
                    placeholder="Busca artistas, canciones..."
                    className="rythme-search-field"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="search-icon"
                >
                    <g>
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                </svg>
            </div>

            {(loading || results.length > 0 || message) &&
                query.trim().length >= 2 && (
                    <div className="search-results-panel">
                        {loading && (
                            <div className="search-status-inline">
                                <span className="material-symbols-outlined rotating">
                                    refresh
                                </span>
                                Buscando en la biblioteca...
                            </div>
                        )}

                        {!loading && message && (
                            <div className="search-status-inline external">
                                <span className="material-symbols-outlined">
                                    language
                                </span>
                                {message}
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
                                <span className="material-symbols-outlined">
                                    search_off
                                </span>
                                No se han encontrado coincidencias
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}
