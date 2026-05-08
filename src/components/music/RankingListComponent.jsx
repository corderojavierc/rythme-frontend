import RankingCardComponent from "./RankingCardComponent";

export default function RankingListComponent({ rankings }) {
  if (!rankings?.length) {
    return <div className="feed-state">No hay datos disponibles para este periodo.</div>;
  }

  return (
    <div className="ranking-list-container">
      {rankings.map((item, index) => (
        <RankingCardComponent key={item.music.id} item={item} index={index} />
      ))}
    </div>
  );
}
