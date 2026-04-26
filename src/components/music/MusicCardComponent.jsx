export default function MusicCardComponent({ music, onClick }) {
  return (
    <div className="song-block" onClick={() => onClick && onClick(music)}>
      <div className="cover">
        <img
          src={music.cover_url}
          alt={music.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div className="song-info">
        <div className="song-title">{music.title}</div>
        <div className="song-artist">{music.artist}</div>
      </div>
    </div>
  );
}
