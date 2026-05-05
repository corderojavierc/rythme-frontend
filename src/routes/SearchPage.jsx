import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchNavigationComponent from "../components/search/SearchNavigationComponent";
import SearchMusicsComponent from "../components/search/SearchMusicsComponent";
import SearchPostsComponent from "../components/search/SearchPostsComponent";
import SearchUsersComponent from "../components/search/SearchUsersComponent";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("musics");

  const query = searchParams.get("q");

  return (
    <div>
      <div className="page-header-container">
        <button
          className="back-button"
          title="Go Back"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="feed-header music-page-title">Resultados de: {query}</h2>
      </div>
      <SearchNavigationComponent
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="profile-content-area">
        {activeTab === "musics" && <SearchMusicsComponent query={query} />}
        {activeTab === "posts" && <SearchPostsComponent query={query} />}
        {activeTab === "users" && <SearchUsersComponent query={query} />}
      </div>
    </div>
  );
}
