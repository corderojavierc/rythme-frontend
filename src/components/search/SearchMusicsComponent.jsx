import { useState, useEffect, useRef } from "react";
import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import { useNavigate } from "react-router-dom";

export default function SearchMusicsComponent({ query }) {
  const [musics, setMusics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusics = async (pageNum = 1) => {
      if (!query) return;
      if (pageNum === 1) setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${getApi()}/music/search?page=${pageNum}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: query }),
          },
        );
        const data = await response.json();
        const results = data.data || [];
        setMusics((prev) => (pageNum === 1 ? results : [...prev, ...results]));
        setHasMore(!!data.links?.next);
      } catch (error) {
        console.error("Error searching musics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setPage(1);
    fetchMusics(1);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      const fetchNextPage = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${getApi()}/music/search?page=${page}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name: query }),
            },
          );
          const data = await response.json();
          const results = data.data || [];
          setMusics((prev) => [...prev, ...results]);
          setHasMore(!!data.links?.next);
        } catch (error) {
          console.error("Error fetching next page:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNextPage();
    }
  }, [page, query]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  const handleMusicClick = (music) => {
    navigate(`/music/${music.id}`, {
      state: {
        songName: music.title,
        artist: music.artist,
        cover_url: music.cover_url,
        global_rating: music.rating,
        count_ratings: music.count_ratings,
        is_valorated: music.is_valorated,
      },
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      if (r >= i) {
        stars.push(
          <span key={i} className="material-symbols-outlined star-filled">
            star
          </span>,
        );
      } else if (r > i - 0.5) {
        stars.push(
          <div key={i} className="star-half-wrapper">
            <span className="material-symbols-outlined star-empty">star</span>
            <span className="material-symbols-outlined star-filled star-half-overlay">
              star
            </span>
          </div>,
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined star-empty">
            star
          </span>,
        );
      }
    }
    return stars;
  };

  if (isLoading && page === 1)
    return <LoaderScreen text="Buscando canciones..." inline />;

  if (musics.length === 0 && !isLoading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined wip-icon">music_off</span>
        <p className="wip-text">No se encontraron canciones para "{query}"</p>
      </div>
    );
  }

  return (
    <div className="search-results-list">
      {musics.map((music, idx) => (
        <div
          key={`${music.id}-${idx}`}
          className="rating-card search-music-item"
          onClick={() => handleMusicClick(music)}
          style={{ padding: "32px" }}
        >
          <div
            className="song-block no-margin"
            style={{
              marginBottom: 0,
              border: "none",
              background: "transparent",
              padding: 0,
              gap: "24px",
            }}
          >
            <div
              className="cover"
              style={{ width: "100px", height: "100px", borderRadius: "16px" }}
            >
              <img
                src={music.cover_url}
                alt={music.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="song-info">
              <div
                className="song-title"
                style={{ fontSize: "22px", marginBottom: "8px" }}
              >
                {music.title}
              </div>
              <div className="song-artist" style={{ fontSize: "16px" }}>
                {music.artist}
              </div>
            </div>
            <div className="music-stats-column" style={{ gap: "8px" }}>
              <div className="stars-container">{renderStars(music.rating)}</div>
              <div
                className="rating-meta"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  className="rating-score-display"
                  style={{ fontSize: "18px" }}
                >
                  {parseFloat(music.rating).toFixed(1)}
                </span>
                <span
                  className="rating-count"
                  style={{ fontSize: "13px", color: "#8b96b0" }}
                >
                  ({music.count_ratings} valoraciones)
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {(hasMore || isLoading) && (
        <div ref={sentinelRef} style={{ height: 40 }} />
      )}
      {isLoading && page > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
            width: "100%",
          }}
        >
          <LoaderScreen inline small text="Buscando más ritmos..." />
        </div>
      )}
      {!hasMore && !isLoading && musics.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
