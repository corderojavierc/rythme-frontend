// Lista de posts con scroll infinito en dos modos: feed global y feed de seguidos.
// Combina dos capas de paginación:
//   1. Paginación del servidor: solicita la siguiente página a la API cuando se llega al final de los datos cargados.
//   2. Paginación virtual local: aunque ya tengamos los datos en memoria, solo mostramos
//      STEP elementos más por vez para no renderizar cientos de tarjetas a la vez.
import { useState, useEffect, useRef } from "react";
import PostCardComponent from "./PostCardComponent";
import LoaderScreen from "../LoaderScreen";
import { useData } from "../../providers/DataProvider";

const STEP = 10;

export default function PostComponent({ fromFollowed = false }) {
  const {
    posts,
    followedPosts,
    loadingPosts,
    loadingFollowedPosts,
    loadingUsers,
    error,
    hasMorePages,
    hasMoreFollowedPages,
    loadMorePosts,
    loadMoreFollowedPosts,
  } = useData();

  const [visibleCount, setVisibleCount] = useState(STEP);
  const sentinelRef = useRef(null);

  const config = fromFollowed
    ? {
        data: followedPosts,
        loading: loadingFollowedPosts || loadingUsers,
        hasMore: hasMoreFollowedPages,
        load: loadMoreFollowedPosts,
        emptyMsg: "No existen opiniones de los usuarios que sigues.",
      }
    : {
        data: posts,
        loading: loadingPosts,
        hasMore: hasMorePages,
        load: loadMorePosts,
        emptyMsg: "Aun no hay opiniones. Se el primero en crear una!",
      };

  const [prevFromFollowed, setPrevFromFollowed] = useState(fromFollowed);
  if (fromFollowed !== prevFromFollowed) {
    setPrevFromFollowed(fromFollowed);
    setVisibleCount(STEP);
  }

  useEffect(() => {
    if (config.loading) return;

    // IntersectionObserver detecta cuando el elemento sentinel (div invisible al final de la lista)
    // entra en el viewport. rootMargin: "400px" lo activa 400px antes de llegar al borde
    // real, dando tiempo a cargar antes de que el usuario llegue al final.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (visibleCount < config.data.length) {
            // Aún hay posts cargados que no se están mostrando: aumentamos visibleCount
            setVisibleCount((prev) => prev + STEP);
          } else if (config.hasMore) {
            // Ya mostramos todos los posts en memoria: pedimos la siguiente página al servidor
            config.load();
          }
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.loading, config.hasMore, visibleCount]);

  const visiblePosts = config.data.slice(0, visibleCount);
  const showSentinel = visibleCount < config.data.length || config.hasMore;

  if (config.loading && config.data.length === 0) {
    return <LoaderScreen inline text="Cargando opiniones..." />;
  }

  if (error) {
    return (
      <div className="feed-state feed-error">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          wifi_off
        </span>
        <span>{error}</span>
      </div>
    );
  }

  if (config.data.length === 0 && !config.hasMore && !config.loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          music_off
        </span>
        <span>{config.emptyMsg}</span>
      </div>
    );
  }

  return (
    <div>
      {visiblePosts.map((post) => (
        <PostCardComponent key={post.id} post={post} />
      ))}

      {showSentinel && <div ref={sentinelRef} style={{ height: 10 }} />}

      {config.loading && config.data.length > 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoaderScreen inline small text="Cargando más..." />
        </div>
      )}

      {!showSentinel && !config.loading && (
        <div className="feed-end">
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de todas las opiniones.
        </div>
      )}
    </div>
  );
}
