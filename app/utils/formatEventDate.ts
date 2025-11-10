// utils/formatEventDate.ts
export function formatEventDate(startDate?: string, endDate?: string) {
  if (!startDate) return ""; // ✅ early return if startDate missing

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


export function formatSlabValidity(startISO?: string, endISO?: string) {
  if (!startISO || !endISO) return "";

  const fmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const start = new Date(startISO);
  const end = new Date(endISO);
  const today = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  // Only two states now: valid or expired
  if (today <= end) {
    return `Valid till ${fmt.format(end)}`;
  }

  return `Validity expired on ${fmt.format(end)}`;
}


//for single dates
export function formatSingleDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};