import { useState, useEffect } from "react";
import { getApi, getAuthHeaders } from "../../config";
import RankingListComponent from "./RankingListComponent";
import LoaderScreen from "../LoaderScreen";

export default function MostRatedRankingComponent({ period }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      let url = `${getApi()}/musics/most-rated`;

      if (period === "actual") {
        url = `${getApi()}/musics/most-rated/actual`;
      } else if (period !== "global") {
        url = `${getApi()}/musics/most-rated-history/${period}`;
      }

      try {
        const response = await fetch(url, {
          headers: getAuthHeaders(),
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

  if (loading)
    return <LoaderScreen text="Actualizando más valoradas..." inline />;

  return <RankingListComponent rankings={rankings} />;
}
