export default function StarsComponent({ rating }) {
  const r = parseFloat(rating) || 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      stars.push(
        <span key={i} className="material-symbols-outlined star-filled">
          star
        </span>,
      );
    } else if (r > i - 0.5) {
      stars.push(
        <div key={i} className="star-half-wrapper">
          <span className="material-symbols-outlined star-empty">star</span>
          <span className="material-symbols-outlined star-filled star-half-overlay">
            star
          </span>
        </div>,
      );
    } else {
      stars.push(
        <span key={i} className="material-symbols-outlined star-empty">
          star
        </span>,
      );
    }
  }

  return <div className="stars-container">{stars}</div>;
}
