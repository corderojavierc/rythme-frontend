import { usePostContext } from "../../providers/PostProvider";
import { useState } from "react";
import { getApi } from "../../config";

const API_LIKES_URL = getApi() + "/likes";

export default function PostLikeButton() {
    const userJson = localStorage.getItem("user");
    const currentUser = userJson ? JSON.parse(userJson) : {};
    const token = localStorage.getItem("token");
    
    const { post, updatePost } = usePostContext();
    const isLiked = !!post.is_liked;
    const likeCount = post.count_likes || 0;

    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    async function handleLike() {
        if (!currentUser.id || !token) {
            alert("¡Debes iniciar sesión para dar like!");
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        if (newIsLiked) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }

        updatePost({
            ...post,
            is_liked: newIsLiked,
            count_likes: newCount,
        });

        try {
            await fetch(API_LIKES_URL, {
                method: newIsLiked ? "POST" : "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    likeable_type: "App\\Models\\Post",
                    likeable_id: post.id.toString(),
                }),
            });
        } catch (error) {
            console.error(error);
            updatePost({
                ...post,
                is_liked: isLiked,
                count_likes: likeCount,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const buttonClass = `action-btn ${isLiked ? "liked" : ""}`;

    return (
        <button
            className={buttonClass}
            onClick={handleLike}
            disabled={isLoading}
            style={{ cursor: "pointer" }}
        >
            <div className={`like-icon-container ${isAnimating ? 'animating' : ''}`} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">favorite</span>
                <svg
                    className="svg-celebrate"
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <line x1="50" y1="20" x2="50" y2="0" strokeWidth="4" />
                    <line x1="80" y1="30" x2="95" y2="15" strokeWidth="4" />
                    <line x1="80" y1="70" x2="95" y2="85" strokeWidth="4" />
                    <line x1="50" y1="80" x2="50" y2="100" strokeWidth="4" />
                    <line x1="20" y1="70" x2="5" y2="85" strokeWidth="4" />
                    <line x1="20" y1="30" x2="5" y2="15" strokeWidth="4" />
                </svg>
            </div>
            {likeCount}
        </button>
    );
}
