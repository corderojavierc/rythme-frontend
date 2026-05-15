import { useNavigate } from "react-router-dom";
import StarsComponent from "./StarsComponent";

export default function RankingCardComponent({ item, index }) {
  const navigate = useNavigate();

  const handleMusicClick = () => {
    navigate(`/music/${item.music.id}`, { state: item.music });
  };

  const getRankBadgeStyle = (index) => {
    if (index === 0) return { background: "#ffd700", color: "#000" };
    if (index === 1) return { background: "#e0e0e0", color: "#000" };
    if (index === 2) return { background: "#cd7f32", color: "#fff" };
    return { background: "#1a202f", color: "#8b96b0" };
  };

  return (
    <div
      className="rating-card search-music-item"
      onClick={handleMusicClick}
      style={{
        padding: "24px",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        className="song-block no-margin"
        style={{
          marginBottom: 0,
          border: "none",
          background: "transparent",
          padding: 0,
          gap: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100px",
            height: "100px",
            flexShrink: 0,
          }}
        >
          <div
            className="cover"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              margin: 0,
            }}
          >
            <img
              src={item.music.cover_url}
              alt={item.music.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "-8px",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              zIndex: 10,
              ...getRankBadgeStyle(index),
            }}
          >
            {index + 1}
          </div>
        </div>

        <div className="song-info">
          <div
            className="song-title"
            style={{
              fontSize: "22px",
              marginBottom: "6px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "700",
            }}
          >
            {item.music.title}
          </div>
          <div
            className="song-artist"
            style={{ fontSize: "16px", color: "#8b96b0" }}
          >
            {item.music.artist}
          </div>
        </div>

        <div className="music-stats-column" style={{ gap: "8px" }}>
          <StarsComponent rating={item.rating} />
          <div
            className="rating-meta"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span
              className="rating-score-display"
              style={{ fontSize: "18px", fontWeight: "700", color: "#ff478e" }}
            >
              {parseFloat(item.rating).toFixed(1)}
            </span>
            <span style={{ fontSize: "12px", color: "#8b96b0" }}>
              ({item.count_ratings} valoraciones)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
