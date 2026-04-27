import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import CommentCardComponent from "../comment/CommentCardComponent";
import { useState, useEffect, useRef } from "react";

const API_URL = getApi();

export default function UserCommentsComponent({ id, isMe }) {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const sentinelRef = useRef(null);

  async function fetchComments(url = `${API_URL}/${id}/comments`) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();

      const newComments = data.data || (Array.isArray(data) ? data : []);
      const nextUrl = data.links?.next || null;

      if (url === `${API_URL}/${id}/comments`) {
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, ...newComments]);
      }
      setNextPageUrl(nextUrl);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setComments([]);
      setNextPageUrl(null);
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (loading || !nextPageUrl) return;

    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchComments(nextPageUrl);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, nextPageUrl]);

  const noComments = comments.length === 0;

  if (loading && noComments) {
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

      {nextPageUrl && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noComments && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!nextPageUrl && !noComments && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">chat</span>
          Has llegado al final de los comentarios.
        </div>
      )}
    </div>
  );
}
