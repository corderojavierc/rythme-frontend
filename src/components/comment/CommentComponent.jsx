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
            setVisibleCount(STEP);
        }
    }, [postId]);

    useEffect(() => {
        if (loadingComments) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (visibleCount < comments.length) {
                        setVisibleCount((prev) => prev + STEP);
                    } else if (hasMoreComments) {
                        loadMoreComments(postId);
                    }
                }
            },
            { rootMargin: "400px" }
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [loadingComments, comments.length, visibleCount, hasMoreComments, postId]);

    const visibleComments = comments.slice(0, visibleCount);
    const showSentinel = visibleCount < comments.length || hasMoreComments;

    if (loadingComments && comments.length === 0) {
        return <LoaderScreen inline text="Cargando comentarios..." />;
    }

    if (error) {
        return (
            <div className="feed-state feed-error">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>error</span>
                <span>{error}</span>
            </div>
        );
    }

    if (comments.length === 0 && !loadingComments) {
        return (
            <div className="feed-state">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>chat_bubble_outline</span>
                <span>Aún no hay comentarios. ¡Sé el primero!</span>
            </div>
        );
    }

    return (
        <div>
            {visibleComments.map((comment) => (
                <CommentCardComponent key={comment.id} comment={comment} />
            ))}

            {showSentinel && <div ref={sentinelRef} style={{ height: 10 }} />}

            {loadingComments && comments.length > 0 && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <LoaderScreen inline small text="Cargando más comentarios..." />
                </div>
            )}

            {!showSentinel && !loadingComments && (
                <div className="feed-end">
                    <span className="material-symbols-outlined">chat</span>
                    Has llegado al final de los comentarios.
                </div>
            )}
        </div>
    );
}
