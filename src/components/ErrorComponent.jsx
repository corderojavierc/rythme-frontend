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
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                        error
                    </span>
                </div>
                <div className="error-text-box">
                    <p className="error-title">{title}</p>
                    <p className="error-subtitle">{subtitle}</p>
                </div>
                <button className="error-close-btn" onClick={onClose}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        close
                    </span>
                </button>
            </div>
        </div>
    );
}
