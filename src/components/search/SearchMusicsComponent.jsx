import { useState, useEffect, useRef } from "react";
import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import MusicSecondCardComponent from "../music/MusicSecondCardComponent";

export default function SearchMusicsComponent({ query }) {
  const [musics, setMusics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);

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
        <MusicSecondCardComponent key={`${music.id}-${idx}`} music={music} />
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
