export default function DoneComponent({ onClose, type }) {
    let title = "Enviado correctamente";
    let subtitle = "Tu comentario ha sido publicado";

    if (type === "post") {
        title = "Post creado";
        subtitle = "Tu valoración ha sido publicada";
    }

    return (
        <div className="done-notification">
            <div className="done-content">
                <div className="done-icon-box">
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                        check_circle
                    </span>
                </div>
                <div className="done-text-box">
                    <p className="done-title">{title}</p>
                    <p className="done-subtitle">{subtitle}</p>
                </div>
                <button className="done-close-btn" onClick={onClose}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        close
                    </span>
                </button>
            </div>
        </div>
    );
}
