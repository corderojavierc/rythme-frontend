import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi, getAuthHeaders } from "../config";
import LoaderScreen from "../components/LoaderScreen";
import MusicNavegator from "../components/music/MusicNavegator";
import PostCardComponent from "../components/post/PostCardComponent";
import { useData } from "../providers/DataProvider";
import NotFoundPage from "./NotFoundPage";

export default function MusicPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { musicPosts, loadingMusicPosts, fetchMusicPosts, resetMusicPosts } =
    useData();

  const [music, setMusic] = useState(() => {
    if (location.state) {
      return {
        title: location.state.title || location.state.songName || "",
        artist: location.state.artist || "",
        cover_url: location.state.cover_url || "",
        rating: location.state.rating || location.state.global_rating || 0,
        count_ratings: location.state.count_ratings || 0,
        is_valorated: !!location.state.is_valorated,
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(!location.state);

  useEffect(() => {
    window.scrollTo(0, 0);
    resetMusicPosts();

    const fetchMusic = async () => {
      try {
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            id,
          );
        const songIsExternal = !Number.isInteger(Number(id)) && !isUUID;

        if (songIsExternal) {
          const response = await fetch(getApi() + "/music", {
            method: "POST",
            headers: getAuthHeaders("application/json"),
            body: JSON.stringify({
              name: music?.title + " " + music?.artist,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            navigate(`/music/${data.data.id}`, {
              state: data.data,
              replace: true,
            });
          }
          return;
        }

        const response = await fetch(`${getApi()}/music/${id}`, {
          headers: getAuthHeaders(),
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
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    if (Number.isInteger(Number(id)) || isUUID) {
      fetchMusicPosts(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !music) {
    return <LoaderScreen text="Cargando canción..." inline={true} />;
  }

  if (!music) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Go Back"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
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
          <div className="song-title song-title-large">{music.title}</div>
          <div className="song-artist song-artist-large">{music.artist}</div>
        </div>

        <div className="rating-container-static">
          <div className="rating-box">
            <div className="rating-score-row">
              <span
                className="material-symbols-outlined"
                style={{ color: "#facc15", fontSize: "28px" }}
              >
                star
              </span>
              {music.rating ? Number(music.rating).toFixed(1) : "-"}
            </div>
            <span className="rating-count-text">
              {music.count_ratings}{" "}
              {music.count_ratings === 1 ? "valoración" : "valoraciones"}
            </span>
          </div>
          {!music.is_valorated && (
            <button
              className="comment-button"
              onClick={() =>
                navigate("/rate", {
                  state: { selectedMusic: music },
                })
              }
            >
              <span className="circle1"></span>
              <span className="circle2"></span>
              <span className="circle3"></span>
              <span className="circle4"></span>
              <span className="circle5"></span>
              <span className="text">Valorar</span>
            </button>
          )}
        </div>
      </div>

      <div className="music-page-tabs-row">
        <div className="tabs-placeholder"></div>
        <MusicNavegator />
        <div className="tabs-action"></div>
      </div>

      <div className="music-posts-container">
        {loadingMusicPosts || !music || String(music.id) !== String(id) ? (
          <LoaderScreen inline small text="Cargando valoraciones..." />
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
