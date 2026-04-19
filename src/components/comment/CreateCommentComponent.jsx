import { getApi } from "../../config";
import { useData } from "../../providers/DataProvider";
const API_COMMENT_URL = `${getApi()}/comments`;
import { useNavigate } from "react-router-dom";

export default function CreateCommentComponent({ post }) {
    const { updatePost } = useData();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    let token = localStorage.getItem("token");
    const fullName =
        user.name && user.second_name
            ? `${user.name} ${user.second_name}`
            : user.name || user.username || "Usuario";
    const initials =
        `${user.name?.[0] || ""}${user.second_name?.[0] || ""}`.toUpperCase() ||
        "?";

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;

        if (!text.trim()) return;

        try {
            const response = await fetch(API_COMMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    post_id: post.id,
                    text: text,
                }),
            });

            if (!response.ok) throw new Error();

            updatePost({
                ...post,
                count_comments: (parseInt(post.count_comments) || 0) + 1,
            });

            e.target.reset();

            navigate("/", { state: { from: "comment" } });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rating-card">
            <div className="rating-header">
                <div className="avatar">
                    {user.profile_image ? (
                        <img
                            src={user.profile_image}
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
                        @{user.username ? user.username : "user"}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    name="text"
                    className="rythme-comment-area"
                    placeholder="Escribe un comentario..."
                ></textarea>
                <button className="comment-button" type="submit">
                    <span className="circle1"></span>
                    <span className="circle2"></span>
                    <span className="circle3"></span>
                    <span className="circle4"></span>
                    <span className="circle5"></span>
                    <span className="text">Comentar</span>
                </button>
            </form>
        </div>
    );
}
