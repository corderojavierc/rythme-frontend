import AsideLayout from "./layout/asideLayout";
import "./App.css";
import PostComponent from "./components/postComponent";

export default function App() {
    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <h2 className="feed-header">Valoraciones</h2>
                <PostComponent />
            </main>

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
                    <input
                        type="text"
                        placeholder="Buscar artistas, canciones…"
                    />
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
                    <div className="section-title">A quién seguir</div>
                    <div className="person-card">
                        <div
                            className="person-avatar"
                            style={{
                                background:
                                    "linear-gradient(135deg, #5c8fff, #a066ff)",
                            }}
                        >
                            JL
                        </div>
                        <div className="person-info">
                            <div className="person-name">Jorge López</div>
                            <div className="person-handle">
                                @jorge_indie · 312 valoraciones
                            </div>
                        </div>
                        <button className="follow-btn">Seguir</button>
                    </div>
                    <div className="person-card">
                        <div
                            className="person-avatar"
                            style={{
                                background:
                                    "linear-gradient(135deg, #ff5da2, #ff9566)",
                            }}
                        >
                            SG
                        </div>
                        <div className="person-info">
                            <div className="person-name">Sara Gómez</div>
                            <div className="person-handle">
                                @sara_pop · 89 valoraciones
                            </div>
                        </div>
                        <button className="follow-btn">Seguir</button>
                    </div>
                    <div className="person-card">
                        <div
                            className="person-avatar"
                            style={{
                                background:
                                    "linear-gradient(135deg, #00c9a7, #5c8fff)",
                            }}
                        >
                            DM
                        </div>
                        <div className="person-info">
                            <div className="person-name">Diego Martín</div>
                            <div className="person-handle">
                                @diego_metal · 541 valoraciones
                            </div>
                        </div>
                        <button className="follow-btn">Seguir</button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
