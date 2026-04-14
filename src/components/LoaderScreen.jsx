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
