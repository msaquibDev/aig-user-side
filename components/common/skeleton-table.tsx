interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  config?: {
    rowHeight?: string;
    gap?: string;
    animation?: "pulse" | "none";
  };
}

export function SkeletonTable({
  rows = 5,
  columns = 6,
  className = "",
  config = {
    rowHeight: "h-4",
    gap: "gap-4",
    animation: "pulse",
  },
}: SkeletonTableProps) {
  const animationClass = config.animation === "pulse" ? "animate-pulse" : "";

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${animationClass} bg-gray-50 ${className}`}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div
                className={`${config.rowHeight} bg-gray-200 rounded ${config.gap}`}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
