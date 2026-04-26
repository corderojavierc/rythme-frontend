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
          <span className="material-symbols-outlined search-icon">search</span>
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
            <div className="event-name">Festival Primavera Sound</div>
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
            <div className="event-name">Noches de Jazz en Sevilla</div>
            <div className="event-loc">
              <span className="material-symbols-outlined">location_on</span>
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
