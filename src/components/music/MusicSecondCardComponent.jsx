import { useNavigate } from "react-router-dom";
import StarsComponent from "./StarsComponent";

export default function MusicSecondCardComponent({ music }) {
  const navigate = useNavigate();

  const handleMusicClick = () => {
    navigate(`/music/${music.id}`, { state: music });
  };

  return (
    <div
      key={`${music.id}`}
      className="rating-card search-music-item"
      onClick={handleMusicClick}
    >
      <div
        className="song-block no-margin"
        style={{
          marginBottom: 0,
          border: "none",
          background: "transparent",
          padding: 0,
        }}
      >
        <div
          className="cover"
          style={{ width: "100px", height: "100px", borderRadius: "16px" }}
        >
          <img
            src={music.cover_url}
            alt={music.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="song-info">
          <div
            className="song-title"
            style={{ fontSize: "22px", marginBottom: "8px" }}
          >
            {music.title}
          </div>
          <div className="song-artist" style={{ fontSize: "16px" }}>
            {music.artist}
          </div>
        </div>
        <div className="music-stats-column" style={{ gap: "8px" }}>
          <StarsComponent rating={music.rating} />
          <div
            className="rating-meta"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span className="rating-score-display" style={{ fontSize: "18px" }}>
              {parseFloat(music.rating).toFixed(1)}
            </span>
            <span
              className="rating-count"
              style={{ fontSize: "13px", color: "#8b96b0" }}
            >
              ({music.count_ratings} valoraciones)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
