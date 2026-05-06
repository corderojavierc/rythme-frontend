import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import MusicSecondCardComponent from "../music/MusicSecondCardComponent";
import { useState, useEffect, useRef } from "react";

const API_URL = getApi();

export default function UserArtistMusicsComponent({ id, isMe }) {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const sentinelRef = useRef(null);

  async function fetchPosts(url = `${API_URL}/music/${id}/musics`) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();

      const newMusics = data.data || (Array.isArray(data) ? data : []);
      const nextUrl = data.links?.next || null;

      if (url === `${API_URL}/music/${id}/musics`) {
        setMusics(newMusics);
      } else {
        setMusics((prev) => [...prev, ...newMusics]);
      }
      setNextPageUrl(nextUrl);
    } catch (error) {
      console.error("Error fetching musics:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setMusics([]);
      setNextPageUrl(null);
      fetchPosts();
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
          fetchPosts(nextPageUrl);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, nextPageUrl]);

  const noMusics = musics.length === 0;

  if (loading && noMusics) {
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

      {nextPageUrl && <div ref={sentinelRef} style={{ height: 10 }} />}

      {loading && !noMusics && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!nextPageUrl && !noMusics && !loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">music_note_2</span>
          Has llegado al final de todas las canciones.
        </div>
      )}
    </div>
  );
}
