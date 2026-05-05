import { useState, useEffect, useRef } from "react";
import { getApi } from "../../config";
import PostCardComponent from "../post/PostCardComponent";
import LoaderScreen from "../LoaderScreen";

export default function SearchPostsComponent({ query }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async (pageNum = 1) => {
      if (!query) return;
      if (pageNum === 1) setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${getApi()}/posts/search?page=${pageNum}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: query }),
          },
        );
        const data = await response.json();
        const results = data.data || [];
        setPosts((prev) => (pageNum === 1 ? results : [...prev, ...results]));
        setHasMore(!!data.links?.next);
      } catch (error) {
        console.error("Error searching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setPage(1);
    fetchPosts(1);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      const fetchNextPage = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${getApi()}/posts/search?page=${page}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ text: query }),
            },
          );
          const data = await response.json();
          const results = data.data || [];
          setPosts((prev) => [...prev, ...results]);
          setHasMore(!!data.links?.next);
        } catch (error) {
          console.error("Error fetching next page:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNextPage();
    }
  }, [page, query]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  if (isLoading && page === 1)
    return <LoaderScreen text="Buscando valoraciones..." inline />;

  if (posts.length === 0 && !isLoading) {
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
      {(hasMore || isLoading) && (
        <div ref={sentinelRef} style={{ height: 40 }} />
      )}
      {isLoading && page > 1 && (
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
      {!hasMore && !isLoading && posts.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
