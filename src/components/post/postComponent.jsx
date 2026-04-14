import { useEffect, useRef, useState } from "react";
import LoaderScreen from "../LoaderScreen";
import { getApi } from "../../config";
import PostCardComponent from "./PostCardComponent";

const API_URL = getApi() + "/posts";
const STEP = 10;

export function StarRating({ rating }) {
    const value = parseFloat(rating);
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

export default function PostComponent({ fromFollowed = false }) {
    const [posts, setPosts] = useState([]);
    const [visible, setVisible] = useState(STEP);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sentinelRef = useRef(null);

    async function fetchPosts() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            if (!response.ok) throw new Error("Error al cargar posts");

            const json = await response.json();
            let allPosts = Array.isArray(json) ? json : json.data;

            if (fromFollowed) {
                try {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const userId = user.id;

                    if (!userId) {
                        setPosts([]);
                        return;
                    }

                    const followsRes = await fetch(`${getApi()}/follows/${userId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    });

                    const followsJson = await followsRes.json();
                    const allFollows = Array.isArray(followsJson)
                        ? followsJson
                        : followsJson.data || [];

                    const followIds = allFollows.map((f) => f.id);

                    allPosts = allPosts.filter((post) =>
                        followIds.includes(post.user_id),
                    );
                } catch (err) {
                    console.error("Error cargando follows:", err);
                }
            }

            allPosts.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at) : 0;
                const dateB = b.created_at ? new Date(b.created_at) : 0;
                return dateB - dateA;
            });

            setPosts(allPosts);
        } catch (err) {
            setError(err.message);
        }
    }

    function showMore() {
        setVisible((prev) => prev + STEP);
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
        if (loading) return;
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    showMore();
                }
            },
            { rootMargin: "400px" },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [loading, posts.length, visible]);

    if (loading) {
        return <LoaderScreen inline text="Cargando posts..." />;
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

    const visiblePosts = posts.slice(0, visible);
    const hasMore = visible < posts.length;

    return (
        <div>
            {visiblePosts.map((post) => (
                <PostCardComponent key={post.id} post={post} />
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
