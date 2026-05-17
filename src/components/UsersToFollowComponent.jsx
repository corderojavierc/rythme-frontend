// Panel del sidebar derecho: sugiere hasta 5 usuarios a seguir (los calcula DataProvider,
// filtrando el propio usuario y los que ya se siguen).
// Al seguir a alguien el botón cambia en tiempo real porque lee "follows" del contexto global.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "./LoaderScreen";
import { useData } from "../providers/DataProvider";
import VerifiedBadgeComponent from "./VerifiedBadgeComponent";

export default function UsersToFollow() {
  const { recommendedUsers, follows, loadingUsers, toggleFollow } = useData();
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const navigate = useNavigate();

  function redirectToProfile(user) {
    navigate(`/${user.username}`, {
      state: {
        id: user.id,
        username: user.username,
        name: user.name,
        profile_image: user.profile_image,
        type: user.type,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        musics: user.musics || 0,
      },
    });
  }

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
              onClick={() => redirectToProfile(user)}
              style={{ cursor: "pointer" }}
            />
            <div
              className="person-info"
              onClick={() => redirectToProfile(user)}
              style={{ cursor: "pointer" }}
            >
              <div className="person-name">
                {user.name}
                <VerifiedBadgeComponent type={user.type} />
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
