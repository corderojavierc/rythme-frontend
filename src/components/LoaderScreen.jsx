import React from "react";
import "./LoaderScreen.css";

export default function LoaderScreen({ text = "Cargando..." }) {
    return (
        <div className="loader-container">
            <ul className="loader">
                <li className="ball"></li>
                <li className="ball"></li>
                <li className="ball"></li>
            </ul>
            <div className="loading-text">{text}</div>
        </div>
    );
}
