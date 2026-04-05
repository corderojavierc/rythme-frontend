import React from "react";
import "./LoaderScreen.css";

export default function LoaderScreen({ text = "Cargando...", inline = false }) {
    return (
        <div className={inline ? "loader-container loader-inline" : "loader-container"}>
            <ul className="loader">
                <li className="ball"></li>
                <li className="ball"></li>
                <li className="ball"></li>
            </ul>
            <div className="loading-text">{text}</div>
        </div>
    );
}
