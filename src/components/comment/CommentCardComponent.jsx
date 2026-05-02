import { useData } from "../../providers/DataProvider";
import { PostProvider } from "../../providers/PostProvider";
import CommentLikeButton from "./CommentLikeButton";
import { useNavigate } from "react-router-dom";

export default function CommentCardComponent({ comment, post }) {
  const navigate = useNavigate();
  const { updateComment } = useData();
  const data = comment || post || {};
  const user = data?.user || data || {};

  let fullName = user?.user_name || user?.username || "Usuario";
  if (user?.name) {
    fullName = user.name;
  }

  function redirectToProfile(e) {
    e.stopPropagation();
    const profileUser = comment || user;
    if (!profileUser?.user_name && !profileUser?.username) return;

    navigate(`/${profileUser.user_name || profileUser.username}`, {
      state: {
        id: profileUser.user_id || profileUser.id,
        username: profileUser.user_name || profileUser.username,
        name: profileUser.name,
        profile_image: profileUser.profile_image,
        type: profileUser.user_type || profileUser.type,
      },
    });
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
            cursor: "pointer",
          }}
          onClick={redirectToProfile}
        >
          <div className="avatar">
            {profileImage ? (
              <img src={profileImage} alt={fullName} />
            ) : (
              fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="user-info">
            <div className="user-name">
              {fullName}
              {(user?.type || user?.user_type) &&
                user.type !== "user" &&
                user.user_type !== "user" && (
                  <span
                    className={`material-symbols-outlined verified-icon verified-${user.type || user.user_type}`}
                    title={user.type || user.user_type}
                  >
                    verified
                  </span>
                )}
            </div>
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
