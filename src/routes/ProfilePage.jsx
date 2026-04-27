import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../config";
import UserPostsComponent from "../components/user/UserPostsComponent";
import UserCommentsComponent from "../components/user/UserCommentsComponent";
import UserLikedComponent from "../components/user/UserLikedComponent";
import UserCardComponent from "../components/user/UserCardComponent";
import UserNavigationComponent from "../components/user/UserNavigationComponent";
import NotFoundPage from "./NotFoundPage";
import LoaderScreen from "../components/LoaderScreen";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const userJson = localStorage.getItem("user");

  const [activeTab, setActiveTab] = useState("ratings");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(!location.state);
  const [user, setUser] = useState(() => {
    if (location.state && location.state.username === username) {
      return {
        id: location.state.user_id || location.state.id || "",
        name: location.state.name || "",
        second_name: location.state.second_name || "",
        profile_image: location.state.profile_image || "",
        username: location.state.username || username,
        followers: location.state.followers || "0",
        following: location.state.following || "0",
        posts: location.state.posts || "0",
      };
    }
    const storedUser = userJson ? JSON.parse(userJson) : {};
    return username === storedUser.username ? storedUser : { username };
  });

  const [prevUsername, setPrevUsername] = useState(username);
  const [prevLocationState, setPrevLocationState] = useState(location.state);

  if (username !== prevUsername) {
    setPrevUsername(username);
    const storedUser = userJson ? JSON.parse(userJson) : {};
    const isMe = username === storedUser.username;

    if (location.state && location.state.username === username) {
      setUser({
        id:
          location.state.user_id ||
          location.state.id ||
          (isMe ? storedUser.id : ""),
        name: location.state.name || (isMe ? storedUser.name : ""),
        second_name:
          location.state.second_name || (isMe ? storedUser.second_name : ""),
        profile_image:
          location.state.profile_image ||
          (isMe ? storedUser.profile_image : ""),
        username: location.state.username || username,
        followers:
          location.state.followers || (isMe ? storedUser.followers : "0"),
        following:
          location.state.following || (isMe ? storedUser.following : "0"),
        posts: location.state.posts || (isMe ? storedUser.posts : "0"),
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
      const storedUser = userJson ? JSON.parse(userJson) : {};
      const isMe = username === storedUser.username;
      return {
        ...prev,
        id:
          location.state.user_id ||
          location.state.id ||
          prev.id ||
          (isMe ? storedUser.id : ""),
        name: location.state.name || prev.name || (isMe ? storedUser.name : ""),
        second_name:
          location.state.second_name ||
          prev.second_name ||
          (isMe ? storedUser.second_name : ""),
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
      };
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setNotFound(false);
    setLoading((prev) => prev || !user.id);

    const controller = new AbortController();
    const { signal } = controller;

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        let response = await fetch(`${getApi()}/users/${username}`, {
          headers,
          signal,
        });

        if (!response.ok) {
          const allUsersRes = await fetch(`${getApi()}/users`, {
            headers,
            signal,
          });
          const allUsers = await allUsersRes.json();
          const usersList = allUsers.data || allUsers;
          const found = usersList.find((u) => u.username === username);
          if (found) {
            setUser(found);
            const me = userJson ? JSON.parse(userJson) : {};
            if (found.username === me.username) {
              localStorage.setItem("user", JSON.stringify(found));
            }
          } else {
            setNotFound(true);
          }
          return;
        }

        const data = await response.json();
        const userData = data.data || data;
        setUser(userData);

        const me = userJson ? JSON.parse(userJson) : {};
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

  const loggedInUser = userJson ? JSON.parse(userJson) : {};
  const isMe = loggedInUser.id && String(user.id) === String(loggedInUser.id);

  const handleFollowChange = (nextFollowingState) => {
    setUser((prev) => ({
      ...prev,
      followers: nextFollowingState
        ? (parseInt(prev.followers) || 0) + 1
        : (parseInt(prev.followers) || 0) - 1,
    }));
  };

  if (loading) {
    return <LoaderScreen text="Cargando perfil..." />;
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
      />

      <div className="profile-content-area">
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
