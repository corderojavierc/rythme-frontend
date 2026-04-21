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

    let displayedPosts;
    let isLoadingCurrent;
    let hasMoreCurrent;
    let loadMore;

    if (fromFollowed) {
        displayedPosts = followedPosts;
        isLoadingCurrent = loadingFollowedPosts;
        hasMoreCurrent = hasMoreFollowedPages;
        loadMore = loadMoreFollowedPosts;
    } else {
        displayedPosts = posts;
        isLoadingCurrent = loadingPosts;
        hasMoreCurrent = hasMorePages;
        loadMore = loadMorePosts;
    }

    function showMore() {
        setVisibleCount((prev) => prev + STEP);
    }

    useEffect(() => {
        setVisibleCount(STEP);
    }, [fromFollowed]);

    useEffect(() => {
        const stillLoading = isLoadingCurrent || (fromFollowed && loadingUsers);
        if (stillLoading) return;

        const element = sentinelRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (!isVisible) return;

                const showingAllLoaded = visibleCount >= displayedPosts.length;
                if (showingAllLoaded && hasMoreCurrent) {
                    loadMore();
                } else if (visibleCount < displayedPosts.length) {
                    showMore();
                }
            },
            { rootMargin: "400px" },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [
        isLoadingCurrent,
        loadingUsers,
        displayedPosts.length,
        visibleCount,
        hasMoreCurrent,
    ]);

    const isLoading = isLoadingCurrent || (fromFollowed && loadingUsers);
    const noPosts = displayedPosts.length === 0;
    const hasMore = visibleCount < displayedPosts.length || hasMoreCurrent;
    const visiblePosts = displayedPosts.slice(0, visibleCount);

    if (isLoading && noPosts) {
        return <LoaderScreen inline text="Cargando opiniones..." />;
    }

    if (error) {
        return (
            <div className="feed-state feed-error">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                >
                    wifi_off
                </span>
                <span>{error}</span>
            </div>
        );
    }

    if (noPosts && !hasMoreCurrent && !isLoading) {
        let emptyMessage = "Aun no hay opiniones. Se el primero en crear una!";
        if (fromFollowed) {
            emptyMessage = "No existen opiniones de los usuarios que sigues.";
        }
        return (
            <div className="feed-state">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                >
                    music_off
                </span>
                <span>{emptyMessage}</span>
            </div>
        );
    }

    return (
        <div>
            {visiblePosts.map((post) => (
                <PostCardComponent key={post.id} post={post} />
            ))}

            {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

            {isLoadingCurrent && !noPosts && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <LoaderScreen inline small text="Cargando más..." />
                </div>
            )}

            {!hasMore && !isLoadingCurrent && (
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
