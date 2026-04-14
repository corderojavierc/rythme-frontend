import { useEffect, useState } from "react";
import LoaderScreen from "./LoaderScreen";
import { getApi } from "../config";

export default function UsersToFollow() {
    const [usersToShow, setUsersToShow] = useState([]);
    const [follows, setFollows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverId, setHoverId] = useState(null);

    let currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    let token = localStorage.getItem("token");

    useEffect(() => {
        async function load() {
            let resUsers = await fetch(getApi() + "/users", {
                headers: { Authorization: "Bearer " + token },
            });
            let jsonUsers = await resUsers.json();
            let allUsers = jsonUsers.data ? jsonUsers.data : jsonUsers;

            let allFollows = [];
            if (currentUser.id) {
                let resFollows = await fetch(
                    getApi() + "/follows/" + currentUser.id,
                    {
                        headers: { Authorization: "Bearer " + token },
                    },
                );
                let jsonFollows = await resFollows.json();
                allFollows = jsonFollows.data ? jsonFollows.data : jsonFollows;
            }

            let followIds = allFollows.map((f) => f.id);
            setFollows(followIds);

            let filtered = allUsers.filter(
                (u) => u.id !== currentUser.id && !followIds.includes(u.id),
            );

            setUsersToShow(filtered.slice(0, 3));
            setLoading(false);
        }
        load();
    }, []);

    async function clickFollow(userId) {
        let isFollowing = follows.includes(userId);
        let url = getApi() + "/follows";

        if (isFollowing) {
            setFollows(follows.filter((id) => id !== userId));
            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: userId,
                }),
            });
        } else {
            setFollows([...follows, userId]);
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: userId,
                }),
            });
        }
    }

    if (loading) {
        return <LoaderScreen inline small text="Cargando usuarios..." />;
    }

    return (
        <div>
            <div className="section-title">A quién seguir</div>
            {usersToShow.map((user) => {
                let isFollowing = follows.includes(user.id);
                let btnText = "Seguir";
                let btnClass = "follow-btn";

                if (isFollowing) {
                    btnClass = "followed follow-btn";
                    btnText =
                        hoverId === user.id ? "Dejar de seguir" : "Siguiendo";
                }

                return (
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
                            className={btnClass}
                            onMouseEnter={() => setHoverId(user.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onClick={() => clickFollow(user.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {btnText}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
