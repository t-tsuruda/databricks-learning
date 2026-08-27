// Lightweight CSRF defense-in-depth for our own API routes.
//
// The session cookie is set with SameSite=Lax (NextAuth default), which
// already blocks the cookie from being sent on cross-site POST requests.
// This same-origin check on the Origin/Referer header is an additional,
// cheap layer for state-changing requests.
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!host) return false;

  // Same-site browser navigations/fetches always send Origin for
  // non-GET requests; absence of Origin (e.g. same-origin fetch in some
  // older browsers) falls back to checking Referer.
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}
