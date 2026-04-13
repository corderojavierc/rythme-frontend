import { usePostContext } from "../providers/PostProvider";
import { useState } from "react";

export default function PostLikeButton() {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const { post, updatePost } = usePostContext();

    const countLiked = post.count_liked ? post.count_liked : 0;
    const isLikedInitial = post.is_liked || false;

    const [liked, setLiked] = useState(isLikedInitial);

    const handleLike = () => {
        console.log(currentUser);
        const newLiked = !liked;
        const newCount = newLiked ? countLiked + 1 : countLiked - 1;

        setLiked(newLiked);
        updatePost({
            count_liked: newCount,
            is_liked: newLiked,
        });
    };

    return (
        <button
            className={`action-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
        >
            <span
                className="material-symbols-outlined"
                style={{
                    fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
                }}
            >
                favorite
            </span>
            {countLiked}
        </button>
    );
}
