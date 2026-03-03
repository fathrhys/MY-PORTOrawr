export const SITE_URL =
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function getSiteUrl() {
  return new URL(SITE_URL);
}
