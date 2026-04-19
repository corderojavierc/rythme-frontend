import { useState } from "react";
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
    const [hoverRating, setHoverRating] = useState(0);
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

    const handleMouseMove = (e, index) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width * 0.45;
        setHoverRating(index + (isHalf ? 0.5 : 1));
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (e, index) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width * 0.45;
        setRating(index + (isHalf ? 0.5 : 1));
    };

    const currentRating = hoverRating || rating;

    const renderInteractiveStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const starValue = i + 1;
            const isFull = currentRating >= starValue;
            const isHalf = !isFull && currentRating >= starValue - 0.5;

            stars.push(
                <div
                    key={i}
                    className="star-input-wrapper"
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => handleClick(e, i)}
                >
                    <span className="material-symbols-outlined star-empty">
                        star
                    </span>
                    {isFull ? (
                        <span
                            className="material-symbols-outlined star-filled star-half-overlay"
                            style={{ width: "100%" }}
                        >
                            star
                        </span>
                    ) : isHalf ? (
                        <span className="material-symbols-outlined star-filled star-half-overlay">
                            star
                        </span>
                    ) : null}
                </div>,
            );
        }
        return stars;
    };

    return (
        <form onSubmit={handleSubmit} className="create-post-form">
            <div className="rating-card create-post-card">
                {selectedMusic ? (
                    <div className="selected-music-container">
                        <div className="selected-music-header">
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
                            <div className="interactive-stars-container">
                                <div className="interactive-stars">
                                    {renderInteractiveStars()}
                                </div>
                                <span className="interactive-rating-score">
                                    {currentRating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <SearchMusicComponent onSelect={setSelectedMusic} />
                )}

                {error && (
                    <div className="post-error-message">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                <textarea
                    name="text"
                    className="rythme-comment-area"
                    placeholder="Escribe tu opinión aquí..."
                    required
                ></textarea>

                <button className="comment-button" type="submit">
                    <span className="circle1"></span>
                    <span className="circle2"></span>
                    <span className="circle3"></span>
                    <span className="circle4"></span>
                    <span className="circle5"></span>
                    <span className="text">Publicar</span>
                </button>
            </div>
        </form>
    );
}
