export default function UserNavigationComponent({
  activeTab,
  onTabChange,
  userType,
}) {
  const tabs = [];

  if (userType === "artist") {
    tabs.push({ id: "musics", label: "Música", icon: "music_note_2" });
  }

  tabs.push(
    { id: "ratings", label: "Valoraciones", icon: "star" },
    { id: "comments", label: "Comentarios", icon: "chat_bubble" },
    { id: "likes", label: "Likes", icon: "favorite" },
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
