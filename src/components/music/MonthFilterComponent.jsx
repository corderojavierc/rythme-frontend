import { useState } from "react";

export default function MonthFilterComponent({ onPeriodChange }) {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const generateMonths = () => {
    const months = [
      { value: "global", label: "Global" },
      { value: "actual", label: "Este mes" },
    ];

    const now = new Date();
    for (let i = 1; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      months.push({
        value: `${year}-${month}`,
        label: `${monthNames[d.getMonth()]} ${year}`,
      });
    }
    return months;
  };

  const months = generateMonths();
  const [selectedPeriod, setSelectedPeriod] = useState(months[0].value);

  const handleSelect = (value) => {
    setSelectedPeriod(value);
    onPeriodChange(value);
  };

  return (
    <div
      className="month-filter-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        overflowX: "auto",
        padding: "4px 0",
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ color: "#8b96b0", fontSize: "20px" }}
      >
        calendar_today
      </span>
      <div className="music-navigator" style={{ margin: 0, padding: "2px" }}>
        {months.map((m) => (
          <button
            key={m.value}
            className={`music-nav-btn ${selectedPeriod === m.value ? "active" : ""}`}
            onClick={() => handleSelect(m.value)}
            style={{ padding: "6px 16px", fontSize: "13px" }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
