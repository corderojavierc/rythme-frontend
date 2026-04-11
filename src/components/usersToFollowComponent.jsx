import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./LoaderScreen";
const API_URL = "http://localhost:8000/api/users";

export default function UsersToFollow() {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [loading, setLoading] = useState(false);

    const [followedMap, setFollowedMap] = useState({});

    async function getUsers() {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            setUsers(data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFollow = async (followedId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/follows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: followedId,
                }),
            });

            if (response.ok) {
                setFollowedMap((prev) => ({ ...prev, [followedId]: true }));
            } else {
                console.error("Error al seguir al usuario");
            }
        } catch (error) {
            console.error("Excepción al intentar seguir:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    if (loading) return <LoaderScreen inline small text="Loading users..." />;

    return (
        <div>
            <div className="section-title">A quién seguir</div>
            {users &&
                users
                    .filter((user) => user.id !== currentUser.id)
                    .slice(0, 3)
                    .map((user) => (
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
                                <div className="person-handle">
                                    @{user.username}
                                </div>
                            </div>
                            <button
                                className="follow-btn"
                                onClick={() => handleFollow(user.id)}
                                disabled={followedMap[user.id]}
                                style={{
                                    opacity: followedMap[user.id] ? 0.7 : 1,
                                    cursor: followedMap[user.id] ? "default" : "pointer"
                                }}
                            >
                                {followedMap[user.id] ? "Siguiendo" : "Seguir"}
                            </button>
                        </div>
                    ))}
        </div>
    );
}
