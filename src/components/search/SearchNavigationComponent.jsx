export default function SearchNavigationComponent({ activeTab, onTabChange }) {
  const tabs = [
    { id: "musics", label: "Canciones", icon: "music_note_2" },
    { id: "posts", label: "Valoraciones", icon: "star" },
    { id: "users", label: "Usuarios", icon: "person" },
  ];

  return (
    <div className="music-navigator full-width">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`music-nav-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
