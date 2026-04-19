export default function ErrorComponent({ onClose, type }) {
    let title = "Ha ocurrido un error";
    let subtitle = "Por favor, inténtalo de nuevo";

    if (type === "error-song-exists") {
        title = "No se puede valorar";
        subtitle = "Ya has valorado esta canción anteriormente";
    }

    return (
        <div className="error-notification">
            <div className="error-content">
                <div className="error-icon-box">
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
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                </div>
                <div className="error-text-box">
                    <p className="error-title">{title}</p>
                    <p className="error-subtitle">{subtitle}</p>
                </div>
                <button className="error-close-btn" onClick={onClose}>
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
}
