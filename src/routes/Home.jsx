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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const [showNotification, setShowNotification] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [notificationType, setNotificationType] = useState(null);

  const [prevFrom, setPrevFrom] = useState(null);
  const from = location.state?.from;

  if (from && from !== prevFrom) {
    const isValidNotification =
      from === "comment" || from === "post" || from === "error-song-exists";

    if (isValidNotification) {
      setPrevFrom(from);
      setNotificationType(from);
      setShowNotification(true);
      setIsExiting(false);
    }
  }

  useEffect(() => {
    if (
      notificationType &&
      (notificationType === "post" || notificationType === "comment")
    ) {
      refreshPosts();
    }
    if (location.state?.from) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationType]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsExiting(false);
      setNotificationType(null);
    }, 300);
  };

  useEffect(() => {
    if (showNotification && !isExiting) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [showNotification, isExiting]);

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
