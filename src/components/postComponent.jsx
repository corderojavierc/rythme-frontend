import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./LoaderScreen";

const API_URL = "http://localhost:8000/api/posts";
const STEP = 5;

function StarRating({ rating }) {
    const value = parseFloat(rating) || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        let className = "star";
        if (value < i - 0.5) className = "star empty";
        else if (value < i) className = "star half";
        stars.push(
            <span key={i} className={className}>
                ★
            </span>,
        );
    }

    return <div className="stars">{stars}</div>;
}

function PostCard({ post }) {
    const fullName =
        post.name && post.second_name
            ? `${post.name} ${post.second_name}`
            : post.name || post.user_name || "User";

    const initials =
        `${post.name?.[0] || ""}${post.second_name?.[0] || ""}`.toUpperCase() ||
        "?";

    function timeAgo(date) {
        if (!date) return "";
        const seconds = (Date.now() - new Date(date)) / 1000;
        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    return (
        <div className="rating-card">
            <div className="rating-header">
                <div className="avatar">
                    {post.profile_image ? (
                        <img
                            src={post.profile_image}
                            alt={fullName}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                    ) : (
                        initials
                    )}
                </div>
                <div className="user-info">
                    <div className="user-name">{fullName}</div>
                    <div className="user-handle">
                        @{post.user_name || "user"}
                    </div>
                </div>
                <div className="timestamp">{timeAgo(post.created_at)}</div>
            </div>

            <div className="song-block">
                <div className="cover">
                    {post.cover_url ? (
                        <img
                            src={post.cover_url}
                            alt={post.music || "Cover"}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "12px",
                            }}
                        />
                    ) : (
                        <span className="cover-emoji">🎵</span>
                    )}
                </div>
                <div className="song-info">
                    <div className="song-title">
                        {post.music || "Unknown song"}
                    </div>
                    <div className="song-artist">
                        {post.artist || "Unknown artist"}
                    </div>
                </div>
            </div>

            <div className="stars-row">
                <StarRating rating={post.rating} />
                <span className="rating-score">
                    {parseFloat(post.rating || 0).toFixed(1)}
                </span>
                <span className="rating-max">/ 5</span>
            </div>

            {post.title && <p className="comment">{post.title}</p>}

            <div className="actions">
                <button className="action-btn liked">
                    <span className="material-symbols-outlined">favorite</span>
                    {post.count_liked ?? 0}
                </button>
                <button className="action-btn">
                    <span className="material-symbols-outlined">
                        chat_bubble
                    </span>
                    0
                </button>
            </div>
        </div>
    );
}

export default function PostComponent() {
    const [posts, setPosts] = useState([]);
    const [visible, setVisible] = useState(STEP);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const postsRef = useRef([]);
    const visibleRef = useRef(STEP);
    const isBusyRef = useRef(false);

    const sentinelRef = useRef(null);

    async function fetchPosts() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(API_URL, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);

            const json = await response.json();
            const allPosts = Array.isArray(json) ? json : (json.data ?? []);

            postsRef.current = allPosts;
            setPosts(allPosts);
        } catch (err) {
            console.error(err);
            setError("Could not connect to the API.");
        }
    }

    function showMore() {
        if (isBusyRef.current) return;
        if (visibleRef.current >= postsRef.current.length) return;

        isBusyRef.current = true;
        const next = visibleRef.current + STEP;
        visibleRef.current = next;
        setVisible(next);
        isBusyRef.current = false;
    }

    useEffect(() => {
        async function init() {
            setLoading(true);
            await fetchPosts();
            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) showMore();
            },
            { rootMargin: "180px" },
        );

        observer.observe(el);
        return () => observer.disconnect();
    });

    if (loading) return <LoaderScreen inline text="Loading posts..." />;

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

    if (posts.length === 0) {
        return (
            <div className="feed-state">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                >
                    music_off
                </span>
                <span>Aun no hay opiniones. Se el primero en crear una!</span>
            </div>
        );
    }

    const hasMore = visible < posts.length;

    return (
        <div>
            {posts.slice(0, visible).map((post, i) => (
                <PostCard key={post.id ?? i} post={post} />
            ))}

            {hasMore && <div ref={sentinelRef} style={{ height: 10 }} />}

            {!hasMore && (
                <div className="feed-end">
                    <span className="material-symbols-outlined">
                        music_note
                    </span>
                    Has llegado al final.
                </div>
            )}
        </div>
    );
}
