const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1708312604073-90639de903fc?q=80&w=1200&auto=format&fit=crop";

export function getDisplayImageUrl(
  source: string | null | undefined,
  fallback = DEFAULT_IMAGE,
) {
  if (!source) return fallback;

  try {
    const hostname = new URL(source).hostname.toLowerCase();
    if (hostname === "loremflickr.com") return fallback;
  } catch {
    return fallback;
  }

  return source;
}
