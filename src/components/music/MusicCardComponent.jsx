export default function MusicCardComponent({ music }) {
    return (
        <div className="song-block">
            <div className="cover">
                <img
                    src={music.cover_url}
                    alt={music.music}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div className="song-info">
                <div className="song-title">{music.music}</div>
                <div className="song-artist">{music.artist}</div>
            </div>
        </div>
    );
}
