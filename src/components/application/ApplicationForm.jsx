import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../config";
import ApplicationSent from "./ApplicationSent";
import LoaderScreen from "../LoaderScreen";

const TYPE_OPTIONS = [
  { value: "artist", label: "Artista musical", icon: "music_note" },
  { value: "content_creator", label: "Creador de contenido", icon: "videocam" },
];

export default function ApplicationForm() {
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const followers = e.target.followers.value;
    const listeners = e.target.listeners.value;
    const youtube = e.target.youtube.value;
    const tiktok = e.target.tiktok.value;
    const instagram = e.target.instagram.value;
    const spotify = e.target.spotify.value;
    const twitch = e.target.twitch.value;
    const description = e.target.description.value;
    setError("");

    if (!type) {
      setError("Selecciona el tipo de cuenta.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${getApi()}/artist-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          followers: followers ? parseInt(followers) : 0,
          listeners: listeners ? parseInt(listeners) : null,
          youtube: youtube || null,
          tiktok: tiktok || null,
          instagram: instagram || null,
          spotify: spotify || null,
          twitch: twitch || null,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Error al enviar la solicitud.");
        setIsLoading(false);
        return;
      }

      e.target.reset();
      setSubmitted(true);
    } catch {
      setError("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoaderScreen text="Enviando solicitud..." />;
  }

  if (submitted) {
    return <ApplicationSent />;
  }

  return (
    <>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Volver"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">
          Solicitud de verificación
        </h2>
      </div>

      <div className="app-form-intro">
        <span className="material-symbols-outlined app-form-intro-icon">
          verified
        </span>
        <div>
          <p className="app-form-intro-title">Programa de verificación</p>
          <p
            className="wip-text"
            style={{ fontSize: "13px", marginTop: "2px" }}
          >
            Completa el formulario y el equipo de RythMe revisará tu solicitud.
          </p>
        </div>
      </div>

      <form className="app-form" onSubmit={handleSubmit}>
        <div className="app-form-section">
          <p className="selection-label">Tipo de cuenta *</p>
          <div className="app-type-grid">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rating-card app-type-card${type === opt.value ? " app-type-selected" : ""}`}
                onClick={() => setType(opt.value)}
              >
                <span className="material-symbols-outlined app-type-icon">
                  {opt.icon}
                </span>
                <span className="app-type-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="app-form-section">
          <p className="selection-label">Alcance</p>
          <div className="app-row">
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">group</span>
                Seguidores totales *
              </label>
              <input
                className="rythme-search-field"
                type="number"
                min="0"
                name="followers"
                placeholder="ej. 5000"
                required
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">headphones</span>
                Oyentes mensuales
              </label>
              <input
                className="rythme-search-field"
                type="number"
                min="0"
                name="listeners"
                placeholder="ej. 2000"
              />
            </div>
          </div>
        </div>

        <div className="app-form-section">
          <p className="selection-label">Redes sociales</p>
          <div className="app-socials-grid">
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">play_circle</span>
                YouTube
              </label>
              <input
                className="rythme-search-field"
                type="url"
                name="youtube"
                placeholder="https://youtube.com/@tucanal"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">music_video</span>
                TikTok
              </label>
              <input
                className="rythme-search-field"
                type="url"
                name="tiktok"
                placeholder="https://tiktok.com/@tuusuario"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">photo_camera</span>
                Instagram
              </label>
              <input
                className="rythme-search-field"
                type="url"
                name="instagram"
                placeholder="https://instagram.com/tuusuario"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">library_music</span>
                Spotify
              </label>
              <input
                className="rythme-search-field"
                type="url"
                name="spotify"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">live_tv</span>
                Twitch
              </label>
              <input
                className="rythme-search-field"
                type="url"
                name="twitch"
                placeholder="https://twitch.tv/tucanal"
              />
            </div>
          </div>
        </div>

        <div className="app-form-section">
          <p className="selection-label">Sobre ti *</p>
          <textarea
            className="rythme-comment-area"
            placeholder="Cuéntanos quién eres, qué tipo de contenido creas y por qué quieres verificarte en RythMe..."
            name="description"
            required
          />
        </div>

        {error && (
          <div className="post-error-message">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <button className="comment-button" type="submit">
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Enviar solicitud</span>
        </button>
      </form>
    </>
  );
}
