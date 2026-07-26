import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#E24E1B",
  "#4381C1",
  "#F79824",
  "#04A777",
  "#5B8C5A",
  "#2176FF",
  "#818D92",
  "#22AAA1",
];

const DEFAULT_ROWS = [
  [{ label: "html" }, { label: "css" }, { label: "javascript" }],
];

export function HighlightGrid({
  rows = DEFAULT_ROWS,
  colors = DEFAULT_COLORS,
  transitionDuration = 250,
  highlightFirst = true,
  className,
}) {
  const gridRef = useRef(null);
  const highlightRef = useRef(null);
  const cellRefs = useRef(new Map());
  const activeRef = useRef(null);
  const [active, setActive] = useState(highlightFirst ? 0 : null);

  const gridRows = useMemo(() => {
    let gi = 0;
    return rows.map((row) =>
      row.map((item) => {
        const idx = gi++;
        return { ...item, color: item.color ?? colors[idx % colors.length], gi: idx };
      })
    );
  }, [rows, colors]);

  const moveTo = useCallback((gi, color) => {
    const grid = gridRef.current;
    const highlight = highlightRef.current;
    const el = cellRefs.current.get(gi);
    if (!grid || !highlight || !el) return;

    const rect = el.getBoundingClientRect();
    const crect = grid.getBoundingClientRect();
    highlight.style.transform = `translate(${rect.left - crect.left}px, ${rect.top - crect.top}px)`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.backgroundColor = color;
    activeRef.current = { gi, color };
  }, []);

  useEffect(() => {
    if (highlightFirst && gridRows[0]?.[0]) {
      const first = gridRows[0][0];
      const h = highlightRef.current;
      if (h) {
        h.style.transitionDuration = "0s";
        moveTo(first.gi, first.color);
        requestAnimationFrame(() => {
          if (h) h.style.transitionDuration = `${transitionDuration}ms`;
        });
      }
    }

    const onResize = () => {
      if (activeRef.current) moveTo(activeRef.current.gi, activeRef.current.color);
    };
    const grid = gridRef.current;
    const ro = grid ? new ResizeObserver(onResize) : null;
    if (grid && ro) ro.observe(grid);
    window.addEventListener("resize", onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [gridRows, highlightFirst, moveTo, transitionDuration]);

  return (
    <div
      ref={gridRef}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#F0EBE0] bg-white shadow-sm sm:flex-row",
        className
      )}
    >
      <div
        ref={highlightRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.28), rgba(255,255,255,0) 52%), linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(0,0,0,0.22))",
          transitionProperty: "transform, width, height, background-color",
          transitionDuration: `${transitionDuration}ms`,
          transitionTimingFunction: "ease",
        }}
      />

      {gridRows.map((row, r) => (
        <div
          key={r}
          className={cn(
            "flex flex-1 flex-col sm:flex-row",
            r < gridRows.length - 1 && "border-b border-[#F0EBE0] sm:border-b-0"
          )}
        >
          {row.map((cell, c) => {
            const isActive = active === cell.gi;
            return (
              <div
                key={cell.gi}
                ref={(el) => {
                  if (el) cellRefs.current.set(cell.gi, el);
                  else cellRefs.current.delete(cell.gi);
                }}
                onMouseEnter={() => {
                  setActive(cell.gi);
                  moveTo(cell.gi, cell.color);
                }}
                className={cn(
                  "relative flex flex-1 items-center justify-center",
                  c < row.length - 1 && "border-b border-[#F0EBE0] sm:border-b-0 sm:border-r"
                )}
              >
                {cell.content ? (
                  cell.content(isActive)
                ) : (
                  <p
                    className={cn(
                      "relative z-[2] font-mono text-[13px] font-medium uppercase transition-colors duration-200",
                      isActive ? "text-white" : "text-neutral-600"
                    )}
                  >
                    ( {cell.label} )
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default HighlightGrid;