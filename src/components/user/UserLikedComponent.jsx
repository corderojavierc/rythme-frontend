import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import CommentCardComponent from "../comment/CommentCardComponent";
import PostCardComponent from "../post/PostCardComponent";
import { useState, useEffect, useRef } from "react";

const API_URL = getApi();

export default function UserLikedComponent({ id, isMe }) {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const sentinelRef = useRef(null);

  async function fetchLikes(url = `${API_URL}/${id}/likes`) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();

      const newLikes = data.data || (Array.isArray(data) ? data : []);
      const nextUrl = data.links?.next || null;

      if (url === `${API_URL}/${id}/likes`) {
        setLikes(newLikes);
      } else {
        setLikes((prev) => [...prev, ...newLikes]);
      }
      setNextPageUrl(nextUrl);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setLikes([]);
      setNextPageUrl(null);
      fetchLikes();
    }
  }, [id]);

  useEffect(() => {
    if (loading || !nextPageUrl) return;

    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchLikes(nextPageUrl);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, nextPageUrl]);

  const noLikes = likes.length === 0;

  if (loading && noLikes) {
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

      {nextPageUrl && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noLikes && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!nextPageUrl && !noLikes && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">favorite</span>
          Has llegado al final de todos los likes.
        </div>
      )}
    </div>
  );
}
