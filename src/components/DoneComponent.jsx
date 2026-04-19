import React from "react";

const DoneComponent = ({ onClose, type }) => {
    const config = {
        comment: {
            title: "Enviado correctamente",
            subtitle: "Tu comentario ha sido publicado",
        },
        post: {
            title: "Post creado",
            subtitle: "Tu valoración ha sido publicada",
        },
    };

    const { title, subtitle } = config[type] || config.comment;

    return (
        <div className="done-notification">
            <div className="done-content">
                <div className="done-icon-box">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        style={{ width: "24px", height: "24px" }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                </div>
                <div className="done-text-box">
                    <p className="done-title">{title}</p>
                    <p className="done-subtitle">{subtitle}</p>
                </div>
                <button className="done-close-btn" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        style={{ width: "20px", height: "20px" }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DoneComponent;
