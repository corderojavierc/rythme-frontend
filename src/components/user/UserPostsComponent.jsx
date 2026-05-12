import { getApi, getAuthHeaders } from "../../config";
import LoaderScreen from "../LoaderScreen";
import PostCardComponent from "../post/PostCardComponent";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

const API_URL = getApi();

export default function UserPostsComponent({ id, isMe }) {
  const loader = async (cursor, signal) => {
    if (!id) return { items: [], next: null };
    const url =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"))
        ? cursor
        : `${API_URL}/${id}/posts`;

    const response = await fetch(url, { headers: getAuthHeaders(), signal });
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();

    const items = data.data || (Array.isArray(data) ? data : []);
    return { items, next: data.links?.next || null };
  };

  const {
    items: posts,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [id],
    initialParam: `${API_URL}/${id}/posts`,
    rootMargin: "200px",
  });

  const noPosts = posts.length === 0;

  if (initialLoading && noPosts) {
    return <LoaderScreen text="Cargando opiniones..." inline={true} />;
  }

  if (noPosts && !loading) {
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
      {posts.map((p) => (
        <PostCardComponent key={p.id} post={p} />
      ))}

      {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noPosts && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!hasMore && !noPosts && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de todas las opiniones.
        </div>
      )}
    </div>
  );
}
