import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AsideLayout from "../layout/AsideLayout";
import RightAsideLayout from "../layout/RightAsideLayout";
import DoneComponent from "../components/DoneComponent";

export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Lógica de notificaciones global (antes en ProtectedRoute)
    useEffect(() => {
        if (location.state?.fromComment) {
            setShowNotification(true);
            setIsExiting(false);
            // Limpia el estado de navegación para que no se repita
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
            {/* El sidebar izquierdo permanece montado y no se reinicia */}
            <AsideLayout />
            
            <main className="main">
                <Outlet />
            </main>

            {/* El sidebar derecho permanece montado */}
            <RightAsideLayout />

            {/* Notificaciones globales */}
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
