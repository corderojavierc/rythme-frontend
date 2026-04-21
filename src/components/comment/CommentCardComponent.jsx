import { PostProvider } from "../../providers/PostProvider";
import { useNavigate } from "react-router-dom";
import { useData } from "../../providers/DataProvider";

export default function CommentCardComponent({ post, type = "post" }) {
    const { updatePost } = useData();
    const navigate = useNavigate();

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

    return (
        <PostProvider post={post} onUpdate={updatePost}>
            <div className="rating-card">
                <div
                    className="rating-header"
                    style={{
                        width: "fit-content",
                    }}
                >
                    <div className="avatar">
                        <img src={post.profile_image} alt={fullName} />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{fullName}</div>
                        <div className="user-handle">@{post.user_name}</div>
                    </div>
                </div>

                <div className="rating-content">
                    <div className="comment">{post.title}</div>
                </div>

                {type === "post" && (
                    <div
                        className="actions"
                        onClick={(e) => e.stopPropagation()}
                    ></div>
                )}
            </div>
        </PostProvider>
    );
}
