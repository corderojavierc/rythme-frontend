// Badge de verificación que muestra un popover al hacer clic con el tipo de cuenta.
// Escucha clicks fuera del componente para cerrar el popover automáticamente.
import { useState, useRef, useEffect } from "react";

export default function VerifiedBadgeComponent({ type }) {
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);

  // Cierra el popover cuando el usuario hace clic fuera del badge.
  // Se usa mousedown (no click) porque mousedown se dispara antes, evitando
  // conflictos con otros eventos click en elementos padre.
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!type || type === "user") return null;

  let translatedType = type;
  if (type === "artist") translatedType = "Artista";
  if (type === "creator") translatedType = "Creador de Contenido";
  if (type === "admin") translatedType = "Administrador";

  const handleToggle = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <div
      className="verified-badge-container"
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className={`material-symbols-outlined verified-icon verified-${type}`}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      >
        verified
      </span>

      {showInfo && (
        <div
          className="verified-info-popover"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="verified-popover-header">
            <span
              className={`material-symbols-outlined verified-icon verified-${type}`}
            >
              verified
            </span>
            <h4 className="verified-popover-title">Cuenta Verificada</h4>
          </div>
          <p className="verified-popover-desc">
            Esta cuenta pertenece a un{" "}
            <span className="verified-popover-type">{translatedType}</span>{" "}
            verificado por RythMe.
          </p>
        </div>
      )}
    </div>
  );
}
