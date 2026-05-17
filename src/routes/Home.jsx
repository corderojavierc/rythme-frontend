// Layout principal de la app: sidebar izquierdo, área central (Outlet) y sidebar derecho.
// También gestiona las notificaciones toast que aparecen tras crear un post/comentario.
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

  // Sube al inicio de la página cada vez que se navega a una ruta distinta
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const [showNotification, setShowNotification] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [notificationType, setNotificationType] = useState(null);

  // location.state.from lo pasan las páginas que navegan de vuelta a Home tras una acción.
  // prevFrom evita mostrar la misma notificación dos veces si el componente re-renderiza.
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
    // Cuando se crea un post o comentario, refrescamos el feed para mostrar el nuevo contenido.
    if (
      notificationType &&
      (notificationType === "post" || notificationType === "comment")
    ) {
      refreshPosts();
    }
    // Limpiamos el state de la URL para que si el usuario recarga la página
    // no vuelva a aparecer la notificación.
    if (location.state?.from) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationType]);

  const handleClose = () => {
    // La clase "exiting" dispara la animación de salida CSS; después de 300ms ocultamos el componente.
    setIsExiting(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsExiting(false);
      setNotificationType(null);
    }, 300);
  };

  // Auto-cierre de la notificación a los 3,8 segundos. Cancelamos el timer si el usuario
  // la cierra manualmente antes, o si la notificación ya estaba saliendo (isExiting).
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
