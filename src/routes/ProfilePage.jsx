import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPostsComponent from "../components/user/UserPostsComponent";
import UserCommentsComponent from "../components/user/UserCommentsComponent";
import UserLikedComponent from "../components/user/UserLikedComponent";
import UserCardComponent from "../components/user/UserCardComponent";
import UserNavigationComponent from "../components/user/UserNavigationComponent";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const location = useLocation();
    const userJson = localStorage.getItem("user");

    const [activeTab, setActiveTab] = useState("ratings");
    const [user, setUser] = useState(() => {
        if (location.state && location.state.username === username) {
            return {
                id: location.state.user_id || location.state.id || "",
                name: location.state.name || "",
                second_name: location.state.second_name || "",
                profile_image: location.state.profile_image || "",
                username: location.state.username || username,
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
                username: location.state.username || username,
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [username]);

    const loggedInUser = userJson ? JSON.parse(userJson) : {};
    const isMe = loggedInUser.id && String(user.id) === String(loggedInUser.id);

    return (
        <>
            <div className="page-header-container">
                <button
                    className="back-button"
                    title="Go Back"
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </button>
                <h2 className="feed-header music-page-title">{username}</h2>
            </div>

            <UserCardComponent user={user} />

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
