export function formatReleaseDate(released?: string | null) {
  if (!released) return "Unreleased";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(released));
}
