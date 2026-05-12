import { getApi, getAuthHeaders } from "../../config";
import LoaderScreen from "../LoaderScreen";
import CommentCardComponent from "../comment/CommentCardComponent";
import PostCardComponent from "../post/PostCardComponent";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

const API_URL = getApi();

export default function UserLikedComponent({ id, isMe }) {
  const loader = async (cursor, signal) => {
    if (!id) return { items: [], next: null };
    const url =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"))
        ? cursor
        : `${API_URL}/${id}/likes`;

    const response = await fetch(url, { headers: getAuthHeaders(), signal });
    if (!response.ok) throw new Error("Failed to fetch likes");
    const data = await response.json();

    const items = data.data || (Array.isArray(data) ? data : []);
    return { items, next: data.links?.next || null };
  };

  const {
    items: likes,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [id],
    initialParam: `${API_URL}/${id}/likes`,
    rootMargin: "200px",
  });

  const noLikes = likes.length === 0;

  if (initialLoading && noLikes) {
    return <LoaderScreen text="Cargando likes..." inline={true} />;
  }

  if (noLikes && !loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          favorite_border
        </span>
        <span>
          {isMe
            ? "Parece que todavía no has encontrado tu ritmo ideal. ¡Explora y dale 'me gusta'!"
            : "Aún no hay canciones que hayan hecho vibrar este perfil."}
        </span>
      </div>
    );
  }

  return (
    <div>
      {likes.map((p) =>
        p.type === "post" ? (
          <PostCardComponent key={p.id} post={p} />
        ) : (
          <CommentCardComponent key={p.id} comment={p} />
        ),
      )}

      {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noLikes && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!hasMore && !noLikes && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">favorite</span>
          Has llegado al final de todos los likes.
        </div>
      )}
    </div>
  );
}
