import UsersToFollow from "../components/usersToFollowComponent";
import "../App.css";
const API_URL = "http://localhost:8000/api/users";

export default function asideLayout() {
    return (
        <aside className="right-sidebar">
            <div className="search-wrap">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Buscar artistas, canciones…" />
            </div>
            <div>
                <div className="section-title">Podría interesarte</div>
                <div className="event-card">
                    <div className="event-date">
                        <span className="event-day">12</span>
                        <span className="event-month">Abr</span>
                    </div>
                    <div className="event-body">
                        <div className="event-name">Rock in Rio Madrid</div>
                        <div className="event-loc">
                            <span className="material-symbols-outlined">
                                location_on
                            </span>
                            IFEMA, Madrid
                        </div>
                    </div>
                </div>
                <div className="event-card">
                    <div className="event-date">
                        <span className="event-day">19</span>
                        <span className="event-month">Abr</span>
                    </div>
                    <div className="event-body">
                        <div className="event-name">
                            Festival Primavera Sound
                        </div>
                        <div className="event-loc">
                            <span className="material-symbols-outlined">
                                location_on
                            </span>
                            Parc del Fòrum, Barcelona
                        </div>
                    </div>
                </div>
                <div className="event-card">
                    <div className="event-date">
                        <span className="event-day">03</span>
                        <span className="event-month">May</span>
                    </div>
                    <div className="event-body">
                        <div className="event-name">
                            Noches de Jazz en Sevilla
                        </div>
                        <div className="event-loc">
                            <span className="material-symbols-outlined">
                                location_on
                            </span>
                            Teatro Lope de Vega, Sevilla
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <UsersToFollow />
            </div>
        </aside>
    );
}
