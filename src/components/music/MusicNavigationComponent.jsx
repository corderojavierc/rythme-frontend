export default function UserNavigationComponent({ activeTab, onTabChange }) {
  const tabs = [];

  tabs.push(
    { id: "ratings", label: "Mejor valoradas", icon: "star" },
    { id: "most-rated", label: "Más valoradas", icon: "chat_bubble" },
  );

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
