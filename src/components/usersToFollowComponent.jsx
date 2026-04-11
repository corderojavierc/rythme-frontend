import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./LoaderScreen";

const API_USERS_URL = "http://localhost:8000/api/users";
const API_FOLLOWS_URL = "http://localhost:8000/api/follows";

export default function UsersToFollow() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followedMap, setFollowedMap] = useState({});
    const [follows, setFollows] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const getUsers = async () => {
        const response = await fetch(API_USERS_URL);
        const data = await response.json();
        setUsers(data.data);
    };

    const getFollows = async () => {
        const response = await fetch(`${API_FOLLOWS_URL}/${currentUser.id}`);
        const data = await response.json();
        setFollows(data.data);
    };

    const handleFollow = async (followedId) => {
        const token = localStorage.getItem("token");
        const isFollowed = followedMap[followedId] === true;

        if (isFollowed) {
            setFollowedMap((prev) => ({ ...prev, [followedId]: false }));

            const response = await fetch(API_FOLLOWS_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: followedId,
                }),
            });

            if (!response.ok) {
                setFollowedMap((prev) => ({ ...prev, [followedId]: true }));
            } else {
                setFollows((prev) => prev.filter((f) => f.id != followedId));
            }
        } else {
            setFollowedMap((prev) => ({ ...prev, [followedId]: true }));

            const response = await fetch(API_FOLLOWS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: followedId,
                }),
            });

            if (!response.ok) {
                setFollowedMap((prev) => ({ ...prev, [followedId]: false }));
            }
        }
    };

    useEffect(() => {
        async function loadAll() {
            setLoading(true);
            await getUsers();
            await getFollows();
            setLoading(false);
        }
        loadAll();
    }, []);

    useEffect(() => {
        if (follows.length > 0) {
            const map = {};
            follows.forEach((f) => {
                map[f.id] = true;
            });
            setFollowedMap(map);
        }
    }, [follows]);

    if (loading) {
        return <LoaderScreen inline small text="Loading users..." />;
    }

    const filteredUsers = users.filter((user) => user.id != currentUser.id);

    const notFollowedUsers = filteredUsers.filter((user) => {
        return !follows.some((f) => f.id == user.id);
    });

    const usersToShow = notFollowedUsers.slice(0, 3);

    return (
        <div>
            <div className="section-title">A quién seguir</div>
            {usersToShow.map((user, index) => (
                <div className="person-card" key={index}>
                    <img
                        className="person-avatar"
                        src={user.profile_image}
                        alt={user.username}
                        style={{ objectFit: "cover" }}
                    />
                    <div className="person-info">
                        <div className="person-name">
                            {user.name} {user.second_name}
                        </div>
                        <div className="person-handle">@{user.username}</div>
                    </div>
                    <button
                        className="follow-btn"
                        onClick={() => handleFollow(user.id)}
                        style={{
                            opacity: followedMap[user.id] ? 0.7 : 1,
                            cursor: followedMap[user.id]
                                ? "default"
                                : "pointer",
                        }}
                    >
                        {followedMap[user.id] ? "Siguiendo" : "Seguir"}
                    </button>
                </div>
            ))}
        </div>
    );
}
