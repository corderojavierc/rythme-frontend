import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AsideLayout from "../layout/AsideLayout";
import RightAsideLayout from "../layout/RightAsideLayout";
import DoneComponent from "../components/DoneComponent";
import ErrorComponent from "../components/ErrorComponent";
import LoaderScreen from "../components/LoaderScreen";
import { useData } from "../providers/DataProvider";

export default function Home() {
    const { refreshPosts, isInitialized } = useData();
    const location = useLocation();
    const navigate = useNavigate();

    const [showNotification, setShowNotification] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [notificationType, setNotificationType] = useState(null);

    useEffect(() => {
        const from = location.state?.from;
        const isValidNotification =
            from === "comment" ||
            from === "post" ||
            from === "error-song-exists";

        if (isValidNotification) {
            setNotificationType(from);
            setShowNotification(true);
            setIsExiting(false);

            const isSuccess = from === "post" || from === "comment";
            if (isSuccess) {
                refreshPosts();
            }

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.from, location.pathname, navigate]);

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

    let notificationClass = "notification-wrapper";
    if (isExiting) {
        notificationClass += " exiting";
    } else {
        notificationClass += " entering";
    }

    const isErrorNotification = notificationType === "error-song-exists";

    if (!isInitialized) {
        return <LoaderScreen text="Cargando Rythme..." />;
    }

    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <Outlet />
            </main>

            <RightAsideLayout />

            {showNotification && (
                <div className={notificationClass}>
                    {isErrorNotification ? (
                        <ErrorComponent onClose={handleClose} type={notificationType} />
                    ) : (
                        <DoneComponent onClose={handleClose} type={notificationType} />
                    )}
                </div>
            )}
        </div>
    );
}
