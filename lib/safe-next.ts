const FALLBACK = "/groups";
const PROBE_ORIGIN = "http://probe.invalid";

/**
 * Returns a same-origin path to redirect to after sign-in, or "/groups".
 * Rejects absolute URLs, protocol-relative ("//host"), backslash tricks and
 * percent-encoded slashes that browsers would treat as another origin.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return FALLBACK;
  }
  try {
    const url = new URL(next, PROBE_ORIGIN);
    if (url.origin !== PROBE_ORIGIN) return FALLBACK;
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.startsWith("//") || decoded.includes("\\")) return FALLBACK;
    return url.pathname + url.search + url.hash;
  } catch {
    return FALLBACK;
  }
}
