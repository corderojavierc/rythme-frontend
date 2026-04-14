export default function CreateCommentComponent({ post }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const fullName =
        user.name && user.second_name
            ? `${user.name} ${user.second_name}`
            : user.name || user.username || "Usuario";
    const initials =
        `${user.name?.[0] || ""}${user.second_name?.[0] || ""}`.toUpperCase() ||
        "?";

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
            <form>
                <textarea
                    className="comment-input"
                    placeholder="Escribe un comentario..."
                ></textarea>
                <button className="comment-button">
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
