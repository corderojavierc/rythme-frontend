import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "../LoaderScreen";
import { getApi, getAuthHeaders } from "../../config";

export default function UserSearchComponent({ onSelect }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          getApi() + "/users/search?text=" + encodeURIComponent(query),
          {
            method: "GET",
            headers: getAuthHeaders(),
            signal: controller.signal,
          },
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        const users = data.data || data;
        setResults(Array.isArray(users) ? users : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleUserClick = (user) => {
    setQuery("");
    setResults([]);
    if (onSelect) {
      onSelect(user);
    } else {
      navigate(`/${user.username}`, {
        state: {
          id: user.id,
          username: user.username,
          name: user.name,
          profile_image: user.profile_image,
          type: user.type,
          followers: user.followers,
          following: user.following,
          posts: user.posts,
          is_following: user.is_following,
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length >= 1) {
      navigate(`/search?q=${query}`);
      setQuery("");
    }
  };

  const showPanel = query.trim().length >= 1;

  return (
    <div
      className={`music-search-integrated${showPanel ? " has-content" : ""}`}
    >
      <form className="search-group" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar artistas, usuarios"
          className="rythme-search-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="material-symbols-outlined search-icon">search</span>
      </form>

      {showPanel && (
        <div className="search-results-panel">
          {loading ? (
            <div className="search-status-inline">
              <span className="material-symbols-outlined rotating">
                refresh
              </span>
              Buscando usuarios...
            </div>
          ) : results.length > 0 ? (
            <div className="music-results-list">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="song-block"
                  onClick={() => handleUserClick(user)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="avatar">
                    <img src={user.profile_image} alt={user.name} />
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-handle">
                      @{user.username} • {user.followers} seguidores
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-music-found-inline">
              No se han encontrado usuarios
            </div>
          )}
          <div
            className="search-query"
            onClick={function () {
              navigate(`/search?q=${query}`);
              setQuery("");
            }}
          >
            Buscar {query}
          </div>
        </div>
      )}
    </div>
  );
}
