import UsersToFollow from "../components/UsersToFollowComponent";
import "../App.css";

export default function RightAsideLayout() {
    return (
        <aside className="right-sidebar">
            <div>
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Buscar artistas, usuarios"
                        className="rythme-search-field"
                    />
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="search-icon"
                    >
                        <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                    </svg>
                </div>
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
