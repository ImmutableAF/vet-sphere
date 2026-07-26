const PATH =
  "M0 30 L58 30 L72 30 L82 8 L92 52 L102 30 L118 30 L182 30 L196 30 L206 8 L216 52 L226 30 L242 30 L300 30 " +
  "L358 30 L372 30 L382 8 L392 52 L402 30 L418 30 L482 30 L496 30 L506 8 L516 52 L526 30 L542 30 L600 30";

export default function PulseLine({ mode = "calm", color = "#4F7A57", className = "" }) {
  const duration = mode === "urgent" ? "1.1s" : mode === "settling" ? "2.2s" : "3.4s";

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="w-full h-full">
        <g style={{ animation: `vs-pulse-scroll ${duration} linear infinite` }}>
          <path
            d={PATH}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}
