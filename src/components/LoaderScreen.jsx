// Spinner de carga reutilizable en tres variantes:
//   - Por defecto: ocupa toda la pantalla (carga inicial de la app)
//   - inline: se integra dentro de un contenido existente (carga de sección)
//   - small: versión reducida para mostrar dentro de listas al cargar más elementos
import React from "react";
import "./LoaderScreen.css";

export default function LoaderScreen({
  text = "Cargando...",
  inline = false,
  small = false,
}) {
  let containerClass = "loader-container";
  if (inline) containerClass += " loader-inline";
  if (small) containerClass += " loader-small";

  return (
    <div className={containerClass}>
      <ul className="loader">
        <li className="ball"></li>
        <li className="ball"></li>
        <li className="ball"></li>
      </ul>
      <div className="loading-text">{text}</div>
    </div>
  );
}
