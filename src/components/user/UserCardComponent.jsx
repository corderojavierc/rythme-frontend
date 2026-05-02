import { useState } from "react";
import { useData } from "../../providers/DataProvider";

export default function UserCardComponent({ user, onFollowChange }) {
  const { follows, toggleFollow } = useData();
  const [hoveredUserId, setHoveredUserId] = useState(null);

  const currentUserJson = localStorage.getItem("user");
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

  if (!user) return null;

  const isFollowing = follows.includes(user.id);
  const isMe = currentUser && String(currentUser.id) === String(user.id);
  const isHovered = hoveredUserId === user.id;

  const handleToggle = () => {
    const nextFollowingState = !isFollowing;
    toggleFollow(user.id);
    if (onFollowChange) onFollowChange(nextFollowingState);
  };

  let buttonClass = "follow-btn profile-follow-btn-large";
  let buttonText = "Seguir";

  if (isFollowing) {
    buttonClass = "followed follow-btn profile-follow-btn-large";
    buttonText = isHovered ? "Dejar de seguir" : "Siguiendo";
  }

  return (
    <div className="rating-card profile-main-card">
      <div className="profile-info-header">
        <div className="profile-avatar-wrapper">
          <img
            src={user.profile_image}
            alt={user.name}
            className="avatar profile-avatar-large"
          />
        </div>

        <div className="profile-info-content">
          <div className="profile-name-row">
            <div className="profile-titles">
              <h1 className="profile-display-name">
                {user.name}
                {user.type && user.type !== "user" && (
                  <span
                    className={`material-symbols-outlined verified-icon verified-${user.type}`}
                    title={user.type}
                  >
                    verified
                  </span>
                )}
              </h1>
              <span className="profile-username">@{user.username}</span>
            </div>
            {!isMe && user.id && (
              <button
                className={buttonClass}
                onMouseEnter={() => setHoveredUserId(user.id)}
                onMouseLeave={() => setHoveredUserId(null)}
                onClick={handleToggle}
              >
                {buttonText}
              </button>
            )}
          </div>

          <p className="profile-bio">
            {user.bio || "Explorando nuevos ritmos en RythMe."}
          </p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-count">{user.followers || "0"}</span>
              <span className="stat-label">
                {user.followers === 1 ? "Seguidor" : "Seguidores"}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.following || "0"}</span>
              <span className="stat-label">Siguiendo</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.posts || "0"}</span>
              <span className="stat-label">Valoraciones</span>
            </div>
          </div>

          <div className="profile-social-links">{}</div>
        </div>
      </div>
    </div>
  );
}
