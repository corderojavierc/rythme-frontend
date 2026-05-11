import { getApi, getAuthHeaders, getUser } from "../../config";
import { useData } from "../../providers/DataProvider";
import { useNavigate } from "react-router-dom";
import VerifiedBadgeComponent from "../VerifiedBadgeComponent";

const API_COMMENT_URL = getApi() + "/comments";

export default function CreateCommentComponent({ post }) {
  const { updatePost } = useData();
  const navigate = useNavigate();

  const user = getUser() || {};

  let fullName = user.username || "Usuario";
  if (user.name) {
    fullName = user.name;
  }

  let initials = "?";
  if (user.name) {
    initials = (user.name?.[0] || "").toUpperCase();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;

    if (!text.trim()) return;

    try {
      const response = await fetch(API_COMMENT_URL, {
        method: "POST",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({
          post_id: post.id,
          text: text,
        }),
      });

      if (!response.ok) throw new Error();

      const newCommentCount = (parseInt(post.count_comments) || 0) + 1;
      updatePost({
        ...post,
        count_comments: newCommentCount,
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
          <div className="user-name">
            {fullName}
            <VerifiedBadgeComponent type={user.type} />
          </div>
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
