import { useState, useEffect } from "react";
import { getApi } from "../../config";
import RankingListComponent from "./RankingListComponent";
import LoaderScreen from "../LoaderScreen";

export default function TopRatedRankingComponent({ period }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${getApi()}/musics/top-rated`;
      
      if (period === "actual") {
        url = `${getApi()}/musics/top-rated/actual`;
      } else if (period !== "global") {
        url = `${getApi()}/musics/top-rated-history/${period}`;
      }

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setRankings(data.data || []);
      } catch (error) {
        console.error("Error:", error);
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [period]);

  if (loading) return <LoaderScreen text="Actualizando mejores valoraciones..." inline />;

  return <RankingListComponent rankings={rankings} />;
}
