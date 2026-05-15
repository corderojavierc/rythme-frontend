import { getApi, getAuthHeaders } from "../../config";
import LoaderScreen from "../LoaderScreen";
import MusicSecondCardComponent from "../music/MusicSecondCardComponent";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

export default function SearchMusicsComponent({ query }) {
  const loader = async (cursor, signal) => {
    if (!query) return { items: [], next: null };
    const isUrl =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"));
    const url = isUrl ? cursor : `${getApi()}/music/search?page=${cursor}`;

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders("application/json"),
      body: JSON.stringify({ name: query }),
      signal,
    });

    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();

    return { items: data.data || [], next: data.links?.next || null };
  };

  const {
    items: musics,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [query],
    initialParam: 1,
    rootMargin: "400px",
  });

  if (initialLoading)
    return <LoaderScreen text="Buscando canciones..." inline />;

  if (musics.length === 0 && !loading) {
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

      {(hasMore || loading) && <div ref={sentinelRef} style={{ height: 40 }} />}

      {loading && !initialLoading && (
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

      {!hasMore && !loading && musics.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
