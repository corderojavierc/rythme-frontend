import { PostProvider } from "../../providers/PostProvider";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import { useData } from "../../providers/DataProvider";

export default function PostCardComponent({ post, type = "post" }) {
    const { updatePost } = useData();

    let fullName = "";
    if (post.name && post.second_name) {
        fullName = post.name + " " + post.second_name;
    } else if (post.name) {
        fullName = post.name;
    } else if (post.user_name) {
        fullName = post.user_name;
    } else {
        fullName = "Usuario";
    }

    const rating = post.rating ? parseFloat(post.rating) : 0;

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            const isFull = rating >= i;
            const isHalf = rating > i - 0.51;

            if (isFull) {
                stars.push(
                    <span key={i} className="material-symbols-outlined star-filled">
                        star
                    </span>,
                );
            } else if (isHalf) {
                stars.push(
                    <div key={i} className="star-half-wrapper">
                        <span className="material-symbols-outlined star-empty">star</span>
                        <span className="material-symbols-outlined star-filled star-half-overlay">star</span>
                    </div>,
                );
            } else {
                stars.push(
                    <span key={i} className="material-symbols-outlined star-empty">
                        star
                    </span>,
                );
            }
        }

        return stars;
    };

    return (
        <PostProvider post={post} onUpdate={updatePost}>
            <div className="rating-card">
                <div className="rating-header">
                    <div className="avatar">
                        <img src={post.profile_image} alt={fullName} />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{fullName}</div>
                        <div className="user-handle">@{post.user_name}</div>
                    </div>
                </div>

                <div className="song-block">
                    <div className="cover">
                        <img
                            src={post.cover_url}
                            alt={post.music}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <div className="song-info">
                        <div className="song-title">{post.music}</div>
                        <div className="song-artist">{post.artist}</div>
                    </div>
                </div>

                <div className="rating-content">
                    <div className="stars-display-row">
                        <div className="stars-container">{renderStars()}</div>
                        <span className="rating-score-display">{rating.toFixed(2)}</span>
                    </div>
                    <div className="comment">{post.title}</div>
                </div>

                {type === "post" && (
                    <div className="actions">
                        <PostLikeButton />
                        <PostCommentButton />
                    </div>
                )}
            </div>
        </PostProvider>
    );
}
