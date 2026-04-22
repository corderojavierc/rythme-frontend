import { useState, useEffect, useRef } from "react";
import CommentCardComponent from "./CommentCardComponent";
import LoaderScreen from "../LoaderScreen";
import { useData } from "../../providers/DataProvider";

const STEP = 10;

export default function CommentComponent({ postId }) {
    const {
        comments,
        loadingComments,
        hasMoreComments,
        fetchComments,
        loadMoreComments,
        resetComments,
        error,
    } = useData();

    const [visibleCount, setVisibleCount] = useState(STEP);
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (postId) {
            resetComments();
            fetchComments(postId);
        }
    }, [postId]);

    function showMore() {
        setVisibleCount((prev) => prev + STEP);
    }

    useEffect(() => {
        if (loadingComments) return;

        const element = sentinelRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (!isVisible) return;

                const showingAllLoaded = visibleCount >= comments.length;
                if (showingAllLoaded && hasMoreComments) {
                    loadMoreComments(postId);
                } else if (visibleCount < comments.length) {
                    showMore();
                }
            },
            { rootMargin: "400px" },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [
        loadingComments,
        comments.length,
        visibleCount,
        hasMoreComments,
        postId,
    ]);

    const noComments = comments.length === 0;
    const hasMore = visibleCount < comments.length || hasMoreComments;
    const visibleComments = comments.slice(0, visibleCount);

    if (loadingComments && noComments) {
        return <LoaderScreen inline text="Cargando comentarios..." />;
    }

    if (error) {
        return (
            <div className="feed-state feed-error">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                >
                    error
                </span>
                <span>{error}</span>
            </div>
        );
    }

    if (noComments && !loadingComments) {
        return (
            <div className="feed-state">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                >
                    chat_bubble_outline
                </span>
                <span>Aún no hay comentarios. ¡Sé el primero!</span>
            </div>
        );
    }

    return (
        <div>
            {visibleComments.map((comment) => (
                <CommentCardComponent key={comment.id} comment={comment} />
            ))}

            {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

            {loadingComments && !noComments && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <LoaderScreen
                        inline
                        small
                        text="Cargando más comentarios..."
                    />
                </div>
            )}

            {!hasMore && !loadingComments && (
                <div className="feed-end">
                    <span className="material-symbols-outlined">chat</span>
                    Has llegado al final de los comentarios.
                </div>
            )}
        </div>
    );
}
