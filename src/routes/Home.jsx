import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AsideLayout from "../layout/AsideLayout";
import RightAsideLayout from "../layout/RightAsideLayout";
import DoneComponent from "../components/DoneComponent";
import ErrorComponent from "../components/ErrorComponent";
import { useData } from "../providers/DataProvider";

export default function Home() {
    const { refreshPosts } = useData();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [notificationType, setNotificationType] = useState(null);

    useEffect(() => {
        if (
            location.state?.from === "comment" ||
            location.state?.from === "post" ||
            location.state?.from === "error-song-exists"
        ) {
            setNotificationType(location.state.from);
            setShowNotification(true);
            setIsExiting(false);

            if (
                location.state?.from === "post" ||
                location.state?.from === "comment"
            ) {
                refreshPosts();
            }

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.from, location.pathname, navigate, refreshPosts]);

    useEffect(() => {
        if (showNotification && !isExiting) {
            const timer = setTimeout(() => {
                handleClose();
            }, 3800);
            return () => clearTimeout(timer);
        }
    }, [showNotification, isExiting]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setShowNotification(false);
            setIsExiting(false);
            setNotificationType(null);
        }, 300);
    };

    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <Outlet />
            </main>

            <RightAsideLayout />

            {showNotification && (
                <div
                    className={`notification-wrapper ${isExiting ? "exiting" : "entering"}`}
                >
                    {notificationType === "error-song-exists" ? (
                        <ErrorComponent
                            onClose={handleClose}
                            type={notificationType}
                        />
                    ) : (
                        <DoneComponent
                            onClose={handleClose}
                            type={notificationType}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
