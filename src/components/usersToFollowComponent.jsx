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
        setLoading(true);
        const response = await fetch(API_USERS_URL);
        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
    };

    const getFollows = async () => {
        setLoading(true);
        const response = await fetch(API_FOLLOWS_URL);
        const data = await response.json();
        setFollows(data.data);
        setLoading(false);
    };

    const handleFollow = async (followedId) => {
        const token = localStorage.getItem("token");

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

        setFollowedMap({ ...followedMap, [followedId]: true });
    };

    useEffect(() => {
        getUsers();
        getFollows();
    }, []);

    if (loading == true) {
        return <LoaderScreen inline small text="Loading users..." />;
    }

    const filteredUsers = users.filter(function (user) {
        return user.id != currentUser.id;
    });

    const notFollowedUsers = filteredUsers.filter(function (user) {
        let isFollowed = false;
        for (let i = 0; i < follows.length; i++) {
            if (
                follows[i].followed_id == user.id &&
                follows[i].follower_id == currentUser.id
            ) {
                isFollowed = true;
            }
        }
        return !isFollowed;
    });

    const usersToShow = [];
    for (let i = 0; i < notFollowedUsers.length; i++) {
        if (i < 3) {
            usersToShow.push(notFollowedUsers[i]);
        }
    }

    return (
        <div>
            <div className="section-title">A quién seguir</div>
            {usersToShow.map((user, index) => {
                return (
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
                            <div className="person-handle">
                                @{user.username}
                            </div>
                        </div>
                        <button
                            className="follow-btn"
                            onClick={() => handleFollow(user.id)}
                            disabled={
                                followedMap[user.id] == true ? true : false
                            }
                            style={{
                                opacity: followedMap[user.id] == true ? 0.7 : 1,
                                cursor:
                                    followedMap[user.id] == true
                                        ? "default"
                                        : "pointer",
                            }}
                        >
                            {followedMap[user.id] == true
                                ? "Siguiendo"
                                : "Seguir"}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
