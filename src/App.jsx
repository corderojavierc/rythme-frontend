import { useAuth } from "./auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import "./App.css";

export default function App() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token");
            auth.setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <Link className="brand-link" to="/">
                    <div className="logo">
                        <img
                            src="/logo-removebg-preview-effect.png"
                            alt="Logo RythMe"
                        />
                    </div>
                    <div className="brand-text">
                        <span className="blue">Ryth</span>
                        <span className="pink">Me</span>
                    </div>
                </Link>
                
                <Link className="nav-item active" to="/">
                    <span className="material-symbols-outlined">home</span>
                    Feed
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">group</span>
                    Seguidos
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">add_ad</span>
                    Valorar
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">search</span>
                    Búscar
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">calendar_today</span>
                    Eventos
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">pan_tool_alt</span>
                    Solicitar
                </Link>
                <Link className="nav-item" to="/">
                    <span className="material-symbols-outlined">person</span>
                    Perfil
                </Link>
                
                <div className="nav-spacer"></div>

                <button onClick={handleLogout} className="nav-item action-btn logout-btn">
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar sesión
                </button>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                >
                    Cambiar tema
                </button>
            </aside>

            <main className="main">
                <h2 className="feed-header">Valoraciones</h2>
                <div className="rating-card">
                    <div className="rating-header">
                        <div className="avatar">MR</div>
                        <div className="user-info">
                            <div className="user-name">Marina Ruiz</div>
                            <div className="user-handle">@marina_escucha</div>
                        </div>
                        <div className="timestamp">hace 23 min</div>
                    </div>
                    <div className="song-block">
                        <div className="cover">
                            <span className="cover-emoji">🎸</span>
                        </div>
                        <div className="song-info">
                            <div className="song-title">Bohemian Rhapsody</div>
                            <div className="song-artist">
                                Queen · 1975 · A Night at the Opera
                            </div>
                            <div className="song-meta">
                                <span className="tag genre">Rock clásico</span>
                                <span className="tag">6:07</span>
                            </div>
                        </div>
                    </div>
                    <div className="stars-row">
                        <div className="stars">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star half">★</span>
                        </div>
                        <span className="rating-score">4.5</span>
                        <span className="rating-max">/ 5</span>
                    </div>
                    <p className="comment">
                        Un absoluto clásico. La progresión operística del puente
                        sigue siendo una de las cosas más audaces que se han
                        grabado en un estudio. Freddie Mercury en su máxima
                        expresión. Imposible no cantarla entera.
                    </p>
                    <div className="actions">
                        <button className="action-btn liked">
                            <span className="material-symbols-outlined">favorite</span>
                            48
                        </button>
                        <button className="action-btn">
                            <span className="material-symbols-outlined">chat_bubble</span>
                            12
                        </button>
                    </div>
                </div>
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
                                <span className="material-symbols-outlined">location_on</span>
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
                                <span className="material-symbols-outlined">location_on</span>
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
                                <span className="material-symbols-outlined">location_on</span>
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
                                background: "linear-gradient(135deg, #5c8fff, #a066ff)"
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
                                background: "linear-gradient(135deg, #ff5da2, #ff9566)"
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
                                background: "linear-gradient(135deg, #00c9a7, #5c8fff)"
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
