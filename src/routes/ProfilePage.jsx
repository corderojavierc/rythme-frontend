import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const location = useLocation();
    const userJson = localStorage.getItem("user");
    const [user, setUser] = useState(() => {
        if (location.state && location.state.username === username) {
            return {
                id: location.state.user_id || location.state.id || "",
                name: location.state.name || "",
                second_name: location.state.second_name || "",
                profile_image: location.state.profile_image || "",
            };
        }
        const storedUser = userJson ? JSON.parse(userJson) : {};
        return username === storedUser.username ? storedUser : { username };
    });

    useEffect(() => {
        if (location.state && location.state.username === username) {
            setUser({
                id: location.state.user_id || location.state.id || "",
                name: location.state.name || "",
                second_name: location.state.second_name || "",
                profile_image: location.state.profile_image || "",
            });
        } else {
            const storedUser = userJson ? JSON.parse(userJson) : {};
            if (username === storedUser.username) {
                setUser(storedUser);
            } else {
                setUser({ username });
            }
        }
    }, [username, location.state, userJson]);

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
            <div className="">
                <img
                    src={user?.profile_image}
                    alt={user?.name}
                    className="profile-image"
                />
                <h3 className="profile-name">
                    {user?.name} {user?.second_name}
                </h3>
            </div>
        </>
    );
}
