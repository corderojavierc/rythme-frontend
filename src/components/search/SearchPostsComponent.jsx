import { getApi, getAuthHeaders } from "../../config";
import PostCardComponent from "../post/PostCardComponent";
import LoaderScreen from "../LoaderScreen";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

export default function SearchPostsComponent({ query }) {
  const loader = async (cursor, signal) => {
    if (!query) return { items: [], next: null };
    const isUrl =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"));
    const url = isUrl ? cursor : `${getApi()}/posts/search?page=${cursor}`;

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders("application/json"),
      body: JSON.stringify({ text: query }),
      signal,
    });

    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();

    return { items: data.data || [], next: data.links?.next || null };
  };

  const {
    items: posts,
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
    return <LoaderScreen text="Buscando valoraciones..." inline />;

  if (posts.length === 0 && !loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined wip-icon">
          speaker_notes_off
        </span>
        <p className="wip-text">
          No se encontraron valoraciones para "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post, idx) => (
        <PostCardComponent key={`${post.id}-${idx}`} post={post} />
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
          <LoaderScreen inline small text="Buscando más valoraciones..." />
        </div>
      )}

      {!hasMore && !loading && posts.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
