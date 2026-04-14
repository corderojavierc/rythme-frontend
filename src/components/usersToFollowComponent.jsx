import { useEffect, useState } from "react";
import LoaderScreen from "./LoaderScreen";
import { getApi } from "../App";

const API_USERS_URL = getApi() + "/users";
const API_FOLLOWS_URL = getApi() + "/follows";

export default function UsersToFollow() {
    const [textBotton, setTextBotton] = useState();
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

        if (isFollowed === true) {
            setFollowedMap({ ...followedMap, [followedId]: false });

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

            if (response.ok === false) {
                setFollowedMap({ ...followedMap, [followedId]: true });
                return;
            }

            const newFollows = follows.filter((f) => f.id !== followedId);
            setFollows(newFollows);
        } else {
            setFollowedMap({ ...followedMap, [followedId]: true });

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

            const data = await response.json();
            console.log(data);

            if (response.ok === false) {
                setFollowedMap({ ...followedMap, [followedId]: false });
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
            let map = {};
            follows.forEach((f) => {
                map[f.id] = true;
            });
            setFollowedMap(map);
        }
    }, [follows]);

    if (loading === true) {
        return <LoaderScreen inline small text="Loading users..." />;
    }

    const filteredUsers = users.filter((user) => user.id !== currentUser.id);

    const notFollowedUsers = filteredUsers.filter((user) => {
        let isFollowed = false;
        follows.forEach((f) => {
            if (f.id === user.id) {
                isFollowed = true;
            }
        });
        return isFollowed === false;
    });

    const usersToShow = notFollowedUsers.slice(0, 3);

    const cards = [];
    usersToShow.forEach((user) => {
        const isFollowed = followedMap[user.id] === true;
        cards.push(
            <div className="person-card" key={user.id}>
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
                    className={`${isFollowed ? "followed follow-btn" : "follow-btn"}`}
                    onMouseEnter={() => setTextBotton("Dejar de seguir")}
                    onMouseLeave={() => setTextBotton("Siguiendo")}
                    onClick={() => handleFollow(user.id)}
                    style={{
                        cursor: "pointer",
                    }}
                >
                    {isFollowed === true ? textBotton : "Seguir"}
                </button>
            </div>,
        );
    });

    return (
        <div>
            <div className="section-title">A quién seguir</div>
            {cards}
        </div>
    );
}
