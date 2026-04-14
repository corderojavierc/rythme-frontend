import { useEffect, useRef, useState } from "react";
import LoaderScreen from "../LoaderScreen";
import { PostProvider } from "../../providers/PostProvider";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import { getApi } from "../../config";
import PostCardComponent from "./PostCardComponent";

const API_URL = getApi() + "/posts";
const STEP = 5;

export function StarRating({ rating }) {
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

        let allPosts = [];
        if (Array.isArray(json) === true) {
            allPosts = json;
        } else {
            allPosts = json.data;
        }

        // Ordenar por fecha de creación (más recientes primero)
        allPosts.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at) : 0;
            const dateB = b.created_at ? new Date(b.created_at) : 0;
            return dateB - dateA;
        });

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
        cards.push(<PostCardComponent key={i} post={post} />);
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
