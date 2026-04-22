import { useData } from "../../providers/DataProvider";
import { PostProvider } from "../../providers/PostProvider";
import CommentLikeButton from "./CommentLikeButton";

export default function CommentCardComponent({ comment, post }) {
    const { updateComment } = useData();
    const data = comment || post || {};
    const user = data.user || data;

    let fullName = user.user_name || user.username || "Usuario";
    if (user.name) {
        fullName = user.name + (user.second_name ? " " + user.second_name : "");
    }

    const text = data.text || data.title || "";
    const profileImage = user.profile_image || "";

    return (
        <PostProvider post={data} onUpdate={updateComment}>
            <div className="rating-card" style={{ cursor: "default" }}>
                <div
                    className="rating-header"
                    style={{
                        width: "fit-content",
                        marginBottom: "12px",
                    }}
                >
                    <div className="avatar">
                        {profileImage ? (
                            <img src={profileImage} alt={fullName} />
                        ) : (
                            fullName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{fullName}</div>
                        <div className="user-handle">
                            @{user.user_name || user.username || "user"}
                        </div>
                    </div>
                </div>

                <div className="rating-content">
                    <div className="comment" style={{ marginBottom: "16px" }}>
                        {text}
                    </div>

                    <div className="actions">
                        <CommentLikeButton />
                    </div>
                </div>
            </div>
        </PostProvider>
    );
}
