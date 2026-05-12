import { getApi, getAuthHeaders } from "../../config";
import LoaderScreen from "../LoaderScreen";
import CommentCardComponent from "../comment/CommentCardComponent";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

const API_URL = getApi();

export default function UserCommentsComponent({ id, isMe }) {
  const loader = async (cursor, signal) => {
    if (!id) return { items: [], next: null };
    const url =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"))
        ? cursor
        : `${API_URL}/${id}/comments`;

    const response = await fetch(url, { headers: getAuthHeaders(), signal });
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();

    const items = data.data || (Array.isArray(data) ? data : []);
    return { items, next: data.links?.next || null };
  };

  const {
    items: comments,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [id],
    initialParam: `${API_URL}/${id}/comments`,
    rootMargin: "200px",
  });

  const noComments = comments.length === 0;

  if (initialLoading && noComments) {
    return <LoaderScreen text="Cargando comentarios..." inline={true} />;
  }

  if (noComments && !loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          chat_bubble_outline
        </span>
        <span>
          {isMe
            ? "Nadie ha subido el volumen aquí todavía. ¡Crea tu primer comentario!"
            : "Aún no hay ecos de comentarios en este perfil... por ahora."}
        </span>
      </div>
    );
  }

  return (
    <div>
      {comments.map((p) => (
        <CommentCardComponent key={p.id} comment={p} />
      ))}

      {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noComments && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!hasMore && !noComments && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">chat</span>
          Has llegado al final de los comentarios.
        </div>
      )}
    </div>
  );
}
