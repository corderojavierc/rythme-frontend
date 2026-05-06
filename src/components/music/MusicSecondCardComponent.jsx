import { useNavigate } from "react-router-dom";

export default function MusicSecondCardComponent({
  music,
  fromArtist = false,
}) {
  const navigate = useNavigate();

  const handleMusicClick = (music) => {
    if (fromArtist) {
      navigate(`/music/${music.id}`, {
        state: {
          songName: music.title,
          artist: music.artist,
          cover_url: music.cover_url,
          global_rating: music.rating,
          count_ratings: music.count_ratings,
          is_valorated: music.is_valorated,
        },
      });
    } else {
      console.log("casi");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      if (r >= i) {
        stars.push(
          <span key={i} className="material-symbols-outlined star-filled">
            star
          </span>,
        );
      } else if (r > i - 0.5) {
        stars.push(
          <div key={i} className="star-half-wrapper">
            <span className="material-symbols-outlined star-empty">star</span>
            <span className="material-symbols-outlined star-filled star-half-overlay">
              star
            </span>
          </div>,
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined star-empty">
            star
          </span>,
        );
      }
    }
    return stars;
  };
  return (
    <div
      key={`${music.id}`}
      className="rating-card search-music-item"
      onClick={() => handleMusicClick(music)}
      style={{
        padding: "24px",
        marginTop: "24px",
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
          <div className="stars-container">{renderStars(music.rating)}</div>
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
