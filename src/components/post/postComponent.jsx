import { useState, useEffect, useRef } from "react";
import PostCardComponent from "./PostCardComponent";
import LoaderScreen from "../LoaderScreen";
import { useData } from "../../providers/DataProvider";

const STEP = 10;

export default function PostComponent({ fromFollowed = false }) {
    const { 
        posts, 
        follows, 
        loadingPosts, 
        loadingUsers, 
        error, 
        hasMorePages, 
        loadMorePosts 
    } = useData();
    
    const [visibleCount, setVisibleCount] = useState(STEP);
    const sentinelRef = useRef(null);

    function showMore() {
        setVisibleCount((prev) => prev + STEP);
    }

    const displayedPosts = fromFollowed 
        ? posts.filter(post => follows.includes(post.user_id))
        : posts;

    useEffect(() => {
        if (loadingPosts || (fromFollowed && loadingUsers)) return;
        
        const element = sentinelRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (visibleCount >= displayedPosts.length && hasMorePages) {
                        loadMorePosts();
                    } else {
                        showMore();
                    }
                }
            },
            { rootMargin: "400px" },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [loadingPosts, loadingUsers, displayedPosts.length, visibleCount, hasMorePages]);

    const isLoading = loadingPosts || (fromFollowed && loadingUsers);

    if (isLoading && displayedPosts.length === 0) {
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

    if (displayedPosts.length === 0) {
        return (
            <div className="feed-state">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                    music_off
                </span>
                <span>
                    {fromFollowed
                        ? "No hay novedades de los artistas que sigues."
                        : "Aun no hay opiniones. Se el primero en crear una!"}
                </span>
            </div>
        );
    }

    const visiblePosts = displayedPosts.slice(0, visibleCount);
    const hasMore = visibleCount < displayedPosts.length || hasMorePages;

    return (
        <div>
            {visiblePosts.map((post) => (
                <PostCardComponent key={post.id} post={post} />
            ))}

            {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

            {loadingPosts && displayedPosts.length > 0 && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <LoaderScreen inline small text="Cargando más..." />
                </div>
            )}

            {!hasMore && !loadingPosts && (
                <div className="feed-end">
                    <span className="material-symbols-outlined">
                        music_note
                    </span>
                    Has llegado al final de todas las opiniones.
                </div>
            )}
        </div>
    );
}
