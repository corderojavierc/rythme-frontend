import AsideLayout from "./layout/AsideLayout";
import { useLocation, useNavigate } from "react-router-dom";
import DoneComponent from "./components/DoneComponent";
import RightAsideLayout from "./layout/rightAsideLayout";
import "./App.css";
import { useEffect, useState } from "react";
import PostComponent from "./components/post/postComponent";
import { getApi } from "./config";

export default function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (location.state?.fromComment) {
            setShowNotification(true);
            setIsExiting(false);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.fromComment, location.pathname, navigate]);

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
        }, 300);
    };

    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <h2 className="feed-header">Valoraciones</h2>
                <PostComponent />
            </main>

            <RightAsideLayout />

            {showNotification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        animation: isExiting
                            ? "slideDown 0.3s ease-in forwards"
                            : "slideUp 0.3s ease-out forwards",
                    }}
                >
                    <DoneComponent onClose={handleClose} />
                </div>
            )}
        </div>
    );
}
