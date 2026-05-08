import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchMusicComponent from "../components/music/SearchMusicComponent";
import MusicNavigationComponent from "../components/music/MusicNavigationComponent";
import MonthFilterComponent from "../components/music/MonthFilterComponent";
import TopRatedRankingComponent from "../components/music/TopRatedRankingComponent";
import MostRatedRankingComponent from "../components/music/MostRatedRankingComponent";

export default function GlobalMusicPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ratings");
  const [period, setPeriod] = useState("global");

  const handleSelect = (song) => {
    navigate(`/music/${song.id}`, { state: song });
  };

  return (
    <>
      <h2 className="feed-header">Música</h2>
      <SearchMusicComponent onSelect={handleSelect} />

      <div className="ranking-filter-bar">
        <MonthFilterComponent onPeriodChange={setPeriod} />
      </div>

      <MusicNavigationComponent
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div
        className="profile-content-area"
        style={{ marginTop: "12px", minHeight: "400px" }}
      >
        {activeTab === "ratings" ? (
          <TopRatedRankingComponent period={period} />
        ) : (
          <MostRatedRankingComponent period={period} />
        )}
      </div>
    </>
  );
}
