import { getApi, getAuthHeaders } from "../../config";
import LoaderScreen from "../LoaderScreen";
import MusicSecondCardComponent from "../music/MusicSecondCardComponent";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

const API_URL = getApi();

export default function UserArtistMusicsComponent({ id, isMe }) {
  const loader = async (cursor, signal) => {
    if (!id) return { items: [], next: null };
    const url =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"))
        ? cursor
        : `${API_URL}/music/${id}/musics`;

    const response = await fetch(url, { headers: getAuthHeaders(), signal });
    if (!response.ok) throw new Error("Failed to fetch musics");
    const data = await response.json();

    const items = data.data || (Array.isArray(data) ? data : []);
    return { items, next: data.links?.next || null };
  };

  const {
    items: musics,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [id],
    initialParam: `${API_URL}/music/${id}/musics`,
    rootMargin: "200px",
  });

  const noMusics = musics.length === 0;

  if (initialLoading && noMusics) {
    return <LoaderScreen text="Cargando canciones..." inline={true} />;
  }

  if (noMusics && !loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          music_off
        </span>
        <span>
          {isMe
            ? "El silencio domina este perfil. ¿Qué tal si compartes tu primer ritmo?"
            : "Este perfil está en silencio... por ahora."}
        </span>
      </div>
    );
  }

  return (
    <div>
      {musics.map((p) => (
        <MusicSecondCardComponent music={p} fromArtist={true} />
      ))}

      {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noMusics && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!hasMore && !noMusics && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">music_note_2</span>
          Has llegado al final de todas las canciones.
        </div>
      )}
    </div>
  );
}
