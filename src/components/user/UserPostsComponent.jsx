import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import PostCardComponent from "../post/PostCardComponent";
import { useState, useEffect, useRef } from "react";

const API_URL = getApi();

export default function UserPostsComponent({ id, isMe }) {
    let token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const sentinelRef = useRef(null);

    async function fetchPosts(url = `${API_URL}/${id}/posts`) {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(url, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await response.json();
            
            const newPosts = data.data || (Array.isArray(data) ? data : []);
            const nextUrl = data.links?.next || null;

            if (url === `${API_URL}/${id}/posts`) {
                setPosts(newPosts);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
            }
            setNextPageUrl(nextUrl);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            setPosts([]);
            setNextPageUrl(null);
            fetchPosts();
        }
    }, [id]);

    useEffect(() => {
        if (loading || !nextPageUrl) return;

        const element = sentinelRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchPosts(nextPageUrl);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [loading, nextPageUrl]);

    const noPosts = posts.length === 0;

    if (loading && noPosts) {
        return <LoaderScreen text="Cargando opiniones..." inline={true} />;
    }

    if (noPosts && !loading) {
        return (
            <div className="feed-state">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                    music_off
                </span>
                <span>
                    {isMe
                        ? "El silencio domina este perfil. ¿Qué tal si compartes tu primer ritmo?"
                        : "Este perfil está en silencio... por ahora."}
                </span>
            </div>
        );
    }

    return (
        <div>
            {posts.map((p) => (
                <PostCardComponent key={p.id} post={p} />
            ))}

            {nextPageUrl && <div ref={sentinelRef} style={{ height: 10 }} />}

            {loading && !noPosts && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <LoaderScreen inline small text="Cargando más..." />
                </div>
            )}

            {!nextPageUrl && !noPosts && !loading && (
                <div className="feed-end">
                    <span className="material-symbols-outlined">music_note</span>
                    Has llegado al final de todas las opiniones.
                </div>
            )}
        </div>
    );
}
