import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./LoaderScreen";

const API_URL = "http://localhost:8000/api/posts";
const STEP = 5;

function StarRating({ rating }) {
    const value = parseFloat(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        let className = "star";
        if (value < i - 0.5) {
            className = "star empty";
        } else if (value < i) {
            className = "star half";
        } else {
            className = "star";
        }
        stars.push(
            <span key={i} className={className}>
                ★
            </span>,
        );
    }

    return <div className="stars">{stars}</div>;
}

function PostCard({ post }) {
    let fullName = "";
    if (post.name && post.second_name) {
        fullName = post.name + " " + post.second_name;
    } else if (post.name) {
        fullName = post.name;
    } else if (post.user_name) {
        fullName = post.user_name;
    } else {
        fullName = "User";
    }

    let initials = "";
    if (post.name) {
        initials = initials + post.name[0];
    }
    if (post.second_name) {
        initials = initials + post.second_name[0];
    }
    initials = initials.toUpperCase();
    if (initials == "") {
        initials = "?";
    }

    function timeAgo(date) {
        const now = Date.now();
        const then = new Date(date);
        const diff = now - then;
        const seconds = diff / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(seconds / 86400);

        if (seconds < 60) {
            return "Ahora mismo";
        }
        if (minutes < 60) {
            return "Hace " + minutes + " minutos";
        }
        if (hours < 24) {
            return "Hace " + hours + " horas";
        }
        return "Hace " + days + " días";
    }

    const rating = post.rating ? post.rating : 0;
    const countLiked = post.count_liked ? post.count_liked : 0;

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
                        @{post.user_name ? post.user_name : "user"}
                    </div>
                </div>
                <div className="timestamp">{timeAgo(post.created_at)}</div>
            </div>

            <div className="song-block">
                <div className="cover">
                    {post.cover_url ? (
                        <img
                            src={post.cover_url}
                            alt={post.music}
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
                        {post.music ? post.music : "Cancion desconocida"}
                    </div>
                    <div className="song-artist">
                        {post.artist ? post.artist : "Artista desconocido"}
                    </div>
                </div>
            </div>

            <div className="stars-row">
                <StarRating rating={rating} />
                <span className="rating-score">
                    {parseFloat(rating).toFixed(1)}
                </span>
                <span className="rating-max">/ 5</span>
            </div>

            {post.title && <p className="comment">{post.title}</p>}

            <div className="actions">
                <button className="action-btn liked">
                    <span className="material-symbols-outlined">favorite</span>
                    {countLiked}
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
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        const json = await response.json();
        console.log("posts response:", json);

        let allPosts = [];
        if (Array.isArray(json) === true) {
            allPosts = json;
        } else {
            allPosts = json.data;
        }

        postsRef.current = allPosts;
        setPosts(allPosts);
    }

    function showMore() {
        if (isBusyRef.current == true) return;
        if (visibleRef.current >= postsRef.current.length) return;

        isBusyRef.current = true;
        const next = visibleRef.current + STEP;
        visibleRef.current = next;
        setVisible(next);
        isBusyRef.current = false;
    }

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            await fetchPosts();
            setLoading(false);
        }
        loadData();
    }, []);

    useEffect(() => {
        const el = sentinelRef.current;
        if (el == null) return;

        const observer = new IntersectionObserver(
            function (entries) {
                if (entries[0].isIntersecting == true) {
                    showMore();
                }
            },
            { rootMargin: "180px" },
        );

        observer.observe(el);
    });

    if (loading == true) {
        return <LoaderScreen inline text="Cargando posts..." />;
    }

    if (error != "") {
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

    if (posts.length == 0) {
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

    let hasMore = false;
    if (visible < posts.length) {
        hasMore = true;
    }

    const visiblePosts = [];
    for (let i = 0; i < posts.length; i++) {
        if (i < visible) {
            visiblePosts.push(posts[i]);
        }
    }

    const cards = [];
    visiblePosts.forEach(function (post, i) {
        cards.push(<PostCard key={i} post={post} />);
    });

    return (
        <div>
            {cards}

            {hasMore == true && (
                <div ref={sentinelRef} style={{ height: 10 }} />
            )}

            {hasMore == false && (
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
