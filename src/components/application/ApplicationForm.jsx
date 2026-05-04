import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../config";
import ApplicationSent from "./ApplicationSent";
import LoaderScreen from "../LoaderScreen";
import ApplicationAccepted from "./ApplicationAccepted";

const TYPE_OPTIONS = [
  { value: "artist", label: "Artista musical", icon: "music_note" },
  { value: "creator", label: "Creador de contenido", icon: "videocam" },
];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyHas, setAlreadyHas] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await fetch(`${getApi()}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const actualUser = userData.data || userData;
          if (actualUser) {
            setUser(actualUser);
            localStorage.setItem("user", JSON.stringify(actualUser));
            window.dispatchEvent(new Event("userUpdated"));

            if (actualUser.type !== "user") {
              setIsLoading(false);
              return;
            }
          }
        }

        const res = await fetch(`${getApi()}/artist-applications/has`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAlreadyHas(data.has_application || data.is_accepted);
      } catch {
        setAlreadyHas(false);
      } finally {
        setIsLoading(false);
      }
    };
    check();
  }, []);

  const extractSpotifyId = (value) => {
    const match = value.match(/artist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const followers = formData.get("followers");
    const listeners = formData.get("listeners");
    const spotifyRaw = formData.get("spotify");

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
          youtube: formData.get("youtube") || null,
          tiktok: formData.get("tiktok") || null,
          instagram: formData.get("instagram") || null,
          spotify: extractSpotifyId(spotifyRaw) || null,
          twitch: formData.get("twitch") || null,
          description: formData.get("description"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Error al enviar la solicitud.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSubmitted(true);
    } catch {
      setError("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  };

  if (user && user.type !== "user") return <ApplicationAccepted user={user} />;
  if (isLoading) return <LoaderScreen text="Cargando..." />;
  if (submitted || alreadyHas) return <ApplicationSent />;

  return (
    <>
      <div className="page-header-container">
        <button className="back-button" onClick={() => navigate(-1)}>
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
                <span className="material-symbols-outlined">group</span>{" "}
                Seguidores totales *
              </label>
              <input
                className="rythme-search-field"
                type="number"
                name="followers"
                required
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">
                <span className="material-symbols-outlined">headphones</span>{" "}
                Oyentes mensuales
              </label>
              <input
                className="rythme-search-field"
                type="number"
                name="listeners"
              />
            </div>
          </div>
        </div>

        <div className="app-form-section">
          <p className="selection-label">Redes sociales</p>
          <div className="app-socials-grid">
            <div className="app-field-group">
              <label className="app-field-label">YouTube</label>
              <input
                className="rythme-search-field"
                type="url"
                name="youtube"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">TikTok</label>
              <input className="rythme-search-field" type="url" name="tiktok" />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">Instagram</label>
              <input
                className="rythme-search-field"
                type="url"
                name="instagram"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">Spotify</label>
              <input
                className="rythme-search-field"
                type="url"
                name="spotify"
              />
            </div>
            <div className="app-field-group">
              <label className="app-field-label">Twitch</label>
              <input className="rythme-search-field" type="url" name="twitch" />
            </div>
          </div>
        </div>

        <div className="app-form-section">
          <p className="selection-label">Sobre ti *</p>
          <textarea
            className="rythme-comment-area"
            name="description"
            required
          />
        </div>

        {error && <div className="post-error-message">{error}</div>}

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
