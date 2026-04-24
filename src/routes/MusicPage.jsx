import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../config";
import LoaderScreen from "../components/LoaderScreen";
import MusicNavegator from "../components/music/MusicNavegator";
import PostCardComponent from "../components/post/PostCardComponent";
import { useData } from "../providers/DataProvider";

export default function MusicPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { musicPosts, loadingMusicPosts, fetchMusicPosts } = useData();

    const [music, setMusic] = useState(() => {
        if (location.state) {
            return {
                title: location.state.songName || "",
                artist: location.state.artist || "",
                cover_url: location.state.cover_url || "",
                rating: location.state.global_rating || 0,
                count_ratings: location.state.count_ratings || 0,
            };
        }
        return null;
    });

    const [loading, setLoading] = useState(!location.state);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchMusic = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${getApi()}/music/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMusic(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
        fetchMusicPosts(id);
    }, [id]);

    if (loading && !music) {
        return <LoaderScreen text="Cargando canción..." />;
    }

    if (!music) {
        return <div className="feed-state">No se pudo cargar la canción.</div>;
    }

    return (
        <>
            <div className="page-header-container">
                <button
                    className="back-button"
                    title="Go Back"
                    onClick={() => navigate(-1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                    >
                        <path d="M11 6L5 12M5 12L11 18M5 12H19"></path>
                    </svg>
                </button>
                <h2 className="feed-header music-page-title">{music.title}</h2>
            </div>
            <div className="divider"></div>
            <div className="song-block song-block-static">
                <div className="cover cover-large">
                    <img src={music.cover_url} alt={music.title} />
                    <div className="cover-overlay"></div>
                </div>

                <div className="song-info">
                    <div className="song-title song-title-large">
                        {music.title}
                    </div>
                    <div className="song-artist song-artist-large">
                        {music.artist}
                    </div>
                </div>

                <div className="rating-box">
                    <div className="rating-score-row">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="#facc15"
                            stroke="#facc15"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        {music.rating ? Number(music.rating).toFixed(1) : "-"}
                    </div>
                    <span className="rating-count-text">
                        {music.count_ratings}{" "}
                        {music.count_ratings === 1
                            ? "valoración"
                            : "valoraciones"}
                    </span>
                </div>
            </div>

            <MusicNavegator />

            <div className="music-posts-container">
                {loadingMusicPosts ? (
                    <LoaderScreen
                        inline
                        small
                        text="Cargando valoraciones..."
                    />
                ) : musicPosts.length > 0 ? (
                    musicPosts.map((post) => (
                        <PostCardComponent key={post.id} post={post} />
                    ))
                ) : (
                    <div className="feed-state">
                        Aún no hay valoraciones para esta canción.
                    </div>
                )}
            </div>
        </>
    );
}
