import { useState, useEffect } from "react";
import SearchMusicComponent from "../music/SearchMusicComponent";
import MusicCardComponent from "../music/MusicCardComponent";
import { getApi } from "../../config";
import { useNavigate, useLocation } from "react-router-dom";
const API_POST_URL = getApi() + "/posts";

export default function CreatePostComponent() {
    let token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedMusic, setSelectedMusic] = useState(
        location.state?.selectedMusic || null,
    );
    const [rating, setRating] = useState(5);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;

        if (!text.trim()) return;
        if (!selectedMusic) {
            setError("Debes seleccionar una canción");
            return;
        }

        try {
            const response = await fetch(API_POST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    music_id: selectedMusic.id,
                    text: text,
                    rating: rating,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors?.music_id) {
                    setError(data.errors.music_id[0]);
                } else {
                    throw new Error();
                }
                return;
            }

            e.target.reset();
            navigate("/", { state: { from: "post" } });
        } catch (error) {
            console.error(error);
            setError("Ha ocurrido un error al crear el post");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="rating-card">
                {selectedMusic ? (
                    <div className="selected-music-container">
                        <div className="selected-music-header">
                            <span className="selection-label">
                                Canción seleccionada:
                            </span>
                            <button
                                type="button"
                                className="remove-selection"
                                onClick={() => setSelectedMusic(null)}
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                                Quitar
                            </button>
                        </div>
                        <MusicCardComponent music={selectedMusic} />
                        <div className="rating-selector">
                            <label>Tu valoración:</label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            <span className="rating-value">{rating} ★</span>
                        </div>
                    </div>
                ) : (
                    <SearchMusicComponent onSelect={setSelectedMusic} />
                )}

                {error && <div className="post-error-message">{error}</div>}

                <textarea
                    type="text"
                    name="text"
                    className="rythme-comment-area"
                    placeholder="Escribe un comentario..."
                    required
                ></textarea>
                <button className="comment-button" type="submit">
                    <span className="circle1"></span>
                    <span className="circle2"></span>
                    <span className="circle3"></span>
                    <span className="circle4"></span>
                    <span className="circle5"></span>
                    <span className="text">Valorar</span>
                </button>
            </div>
        </form>
    );
}
