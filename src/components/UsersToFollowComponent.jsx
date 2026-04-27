import { useState } from "react";
import LoaderScreen from "./LoaderScreen";
import { useData } from "../providers/DataProvider";

export default function UsersToFollow() {
  const { recommendedUsers, follows, loadingUsers, toggleFollow } = useData();
  const [hoveredUserId, setHoveredUserId] = useState(null);

  if (loadingUsers && recommendedUsers.length === 0) {
    return <LoaderScreen inline small text="Buscando gente..." />;
  }

  if (recommendedUsers.length === 0 && !loadingUsers) {
    return null;
  }

  return (
    <div>
      <div className="section-title">A quién seguir</div>
      {recommendedUsers.map((user) => {
        const isFollowing = follows.includes(user.id);
        const isHovered = hoveredUserId === user.id;

        let buttonClass = "follow-btn";
        let buttonText = "Seguir";

        if (isFollowing) {
          buttonClass = "followed follow-btn";
          if (isHovered) {
            buttonText = "Dejar de seguir";
          } else {
            buttonText = "Siguiendo";
          }
        }

        return (
          <div className="person-card" key={user.id}>
            <img
              className="person-avatar"
              src={user.profile_image}
              alt={user.username}
            />
            <div className="person-info">
              <div className="person-name">
                {user.name} {user.second_name}
              </div>
              <div className="person-handle">@{user.username}</div>
            </div>
            <button
              className={buttonClass}
              onMouseEnter={() => setHoveredUserId(user.id)}
              onMouseLeave={() => setHoveredUserId(null)}
              onClick={() => toggleFollow(user.id)}
              style={{ cursor: "pointer" }}
            >
              {buttonText}
            </button>
          </div>
        );
      })}
    </div>
  );
}
