import { usePostContext } from "../../providers/PostProvider";
import { useState } from "react";
import { getApi } from "../../App";

const API_LIKES_URL = getApi() + "/likes";

export default function PostLikeButton() {
    let userString = localStorage.getItem("user");
    let currentUser = {};

    if (userString != null) {
        currentUser = JSON.parse(userString);
    }

    let token = localStorage.getItem("token");
    const context = usePostContext();
    let post = context.post;
    let updatePost = context.updatePost;

    let isLiked = false;
    if (post.is_liked == true) {
        isLiked = true;
    }

    let countLikes = 0;
    if (post.count_likes) {
        countLikes = post.count_likes;
    }

    const [isLoading, setIsLoading] = useState(false);

    async function handleLike() {
        if (currentUser.id == undefined || token == null) {
            alert("¡Debes iniciar sesión para dar like!");
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        let newIsLiked = false;
        if (isLiked) {
            newIsLiked = false;
        } else {
            newIsLiked = true;
        }

        let newCount = 0;
        if (newIsLiked) {
            newCount = countLikes + 1;
        } else {
            newCount = countLikes - 1;
        }

        updatePost({
            ...post,
            is_liked: newIsLiked,
            count_likes: newCount,
        });

        let fetchMethod = "";
        if (newIsLiked == true) {
            fetchMethod = "POST";
        } else {
            fetchMethod = "DELETE";
        }

        try {
            await fetch(API_LIKES_URL, {
                method: fetchMethod,
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
            console.error("Error al actualizar el like:", error);
            updatePost({
                ...post,
                is_liked: isLiked,
                count_likes: countLikes,
            });
        }

        setIsLoading(false);
    }

    let buttonClass = "action-btn";
    if (isLiked == true) {
        buttonClass = buttonClass + " liked";
    }

    return (
        <button
            className={buttonClass}
            onClick={handleLike}
            disabled={isLoading}
            style={{
                cursor: "pointer",
            }}
        >
            <div className="like-icon-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            {countLikes}
        </button>
    );
}
