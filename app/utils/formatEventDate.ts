// utils/formatEventDate.ts
export function formatEventDate(startDate: string, endDate?: string) {
  // Parse "21/07/2025" into JS Date
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const start = parseDate(startDate);
  if (!endDate) return formatter.format(start);

  const end = parseDate(endDate);

  // If same date → show only once
  if (start.getTime() === end.getTime()) {
    return formatter.format(start);
  }

  // If different → show range
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}
