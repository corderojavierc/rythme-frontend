import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi, getAuthHeaders, getUser } from "../config";
import UserPostsComponent from "../components/user/UserPostsComponent";
import UserCommentsComponent from "../components/user/UserCommentsComponent";
import UserLikedComponent from "../components/user/UserLikedComponent";
import UserCardComponent from "../components/user/UserCardComponent";
import UserNavigationComponent from "../components/user/UserNavigationComponent";
import UserArtistMusicsComponent from "../components/user/UserArtistMusicsComponent";
import NotFoundPage from "./NotFoundPage";
import LoaderScreen from "../components/LoaderScreen";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const [notFound, setNotFound] = useState(false);
  const storedUserInit = getUser() || {};
  const isOwnProfile = username === storedUserInit.username;
  const [loading, setLoading] = useState(!location.state && !isOwnProfile);
  const [user, setUser] = useState(() => {
    if (location.state && location.state.username === username) {
      return {
        id: location.state.user_id || location.state.id || "",
        name: location.state.name || "",
        profile_image: location.state.profile_image || "",
        username: location.state.username || username,
        followers: location.state.followers || "0",
        following: location.state.following || "0",
        posts: location.state.posts || "0",
        type: location.state.type || "",
        musics: location.state.musics || "0",
      };
    }
    const storedUser = getUser() || {};
    return username === storedUser.username ? storedUser : { username };
  });

  const [prevUsername, setPrevUsername] = useState(username);
  const [prevLocationState, setPrevLocationState] = useState(location.state);

  if (username !== prevUsername) {
    setPrevUsername(username);
    const storedUser = getUser() || {};
    const isMe = username === storedUser.username;

    if (location.state && location.state.username === username) {
      setUser({
        id:
          location.state.user_id ||
          location.state.id ||
          (isMe ? storedUser.id : ""),
        name: location.state.name || (isMe ? storedUser.name : ""),
        profile_image:
          location.state.profile_image ||
          (isMe ? storedUser.profile_image : ""),
        username: location.state.username || username,
        followers:
          location.state.followers || (isMe ? storedUser.followers : "0"),
        following:
          location.state.following || (isMe ? storedUser.following : "0"),
        posts: location.state.posts || (isMe ? storedUser.posts : "0"),
        type: location.state.type || (isMe ? storedUser.type : ""),
        musics: location.state.musics || (isMe ? storedUser.musics : ""),
      });
    } else {
      if (isMe) {
        setUser(storedUser);
      } else {
        setUser({ username });
      }
    }
  } else if (
    location.state &&
    location.state.username === username &&
    location.state !== prevLocationState
  ) {
    setPrevLocationState(location.state);
    setUser((prev) => {
      const storedUser = getUser() || {};
      const isMe = username === storedUser.username;
      return {
        ...prev,
        id:
          location.state.user_id ||
          location.state.id ||
          prev.id ||
          (isMe ? storedUser.id : ""),
        name: location.state.name || prev.name || (isMe ? storedUser.name : ""),
        profile_image:
          location.state.profile_image ||
          prev.profile_image ||
          (isMe ? storedUser.profile_image : ""),
        followers:
          location.state.followers ||
          prev.followers ||
          (isMe ? storedUser.followers : "0"),
        following:
          location.state.following ||
          prev.following ||
          (isMe ? storedUser.following : "0"),
        posts:
          location.state.posts || prev.posts || (isMe ? storedUser.posts : "0"),
        type: location.state.type || prev.type || (isMe ? storedUser.type : ""),
        musics:
          location.state.musics ||
          prev.musics ||
          (isMe ? storedUser.musics : ""),
      };
    });
  }
  const [activeTab, setActiveTab] = useState(
    user.type == "artist" ? "musics" : "ratings",
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setNotFound(false);
    if (!user.id) setLoading(true);

    const controller = new AbortController();
    const { signal } = controller;

    const fetchUser = async () => {
      try {
        let response = await fetch(`${getApi()}/users/${username}`, {
          headers: getAuthHeaders(),
          signal,
        });

        if (!response.ok) {
          if (!isOwnProfile) {
            setNotFound(true);
          }
          return;
        }

        const data = await response.json();
        const userData = data.data || data;
        setUser(userData);

        const me = getUser() || {};
        if (userData.username === me.username) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching user data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loggedInUser = getUser() || {};
  const isMe = loggedInUser.id && String(user.id) === String(loggedInUser.id);

  const handleFollowChange = (nextFollowingState) => {
    setUser((prev) => ({
      ...prev,
      followers: nextFollowingState
        ? (parseInt(prev.followers) || 0) + 1
        : (parseInt(prev.followers) || 0) - 1,
    }));
  };

  console.log(user.type);

  if (loading) {
    return <LoaderScreen text="Cargando perfil..." inline={true} />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Go Back"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">{username}</h2>
      </div>

      <UserCardComponent user={user} onFollowChange={handleFollowChange} />

      <UserNavigationComponent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userType={user.type}
      />

      <div className="profile-content-area">
        {activeTab === "musics" && (
          <UserArtistMusicsComponent id={user.id} isMe={isMe} />
        )}
        {activeTab === "ratings" && (
          <UserPostsComponent id={user.id} isMe={isMe} />
        )}
        {activeTab === "comments" && (
          <UserCommentsComponent id={user.id} isMe={isMe} />
        )}
        {activeTab === "likes" && (
          <UserLikedComponent id={user.id} isMe={isMe} />
        )}
      </div>
    </>
  );
}
