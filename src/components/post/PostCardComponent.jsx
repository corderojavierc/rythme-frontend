import { Link } from "react-router-dom";
import { PostProvider } from "../../providers/PostProvider";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import { useData } from "../../providers/DataProvider";

export default function PostCardComponent({ post, type = "post" }) {
    const { updatePost } = useData();

    let fullName = "";
    if (post.name && post.second_name) {
        fullName = `${post.name} ${post.second_name}`;
    } else {
        fullName = post.name || post.user_name || "Usuario";
    }

    const rating = post.rating ? post.rating : 0;

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
                    <div className="stars-row">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                    key={i}
                                    className={
                                        i <= Math.round(rating)
                                            ? "star"
                                            : "star empty"
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-score">{rating}</span>
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
