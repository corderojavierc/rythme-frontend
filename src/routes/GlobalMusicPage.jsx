import { useNavigate } from "react-router-dom";
import SearchMusicComponent from "../components/music/SearchMusicComponent";

export default function GlobalMusicPage() {
    const navigate = useNavigate();

    const handleSelect = (song) => {
        navigate(`/music/${song.id}`, { state: song });
    };

    return (
        <>
            <h2 className="feed-header">Música</h2>
            <SearchMusicComponent onSelect={handleSelect} />
        </>
    );
}
