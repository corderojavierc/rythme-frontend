import { StarRating } from "./PostComponent";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import { PostProvider } from "../../providers/PostProvider";

export default function PostCardComponent({ post, type = "post" }) {
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

    return (
        <PostProvider post={post}>
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
