const API_PORT = 5300;

/**
 * Resolves the API base URL for a given browser location.
 *
 * In most environments the API is reached on the same host at `API_PORT`.
 * Hosting platforms that forward each port as its own subdomain are handled
 * transparently, so callers never need to know about them.
 */
export function resolveApiBaseUrl(location: {
  protocol: string;
  hostname: string;
}): string {
  const { protocol, hostname } = location;
  const forwardedHost = forwardedApiHost(hostname);

  return forwardedHost
    ? `${protocol}//${forwardedHost}`
    : `${protocol}//${hostname}:${API_PORT}`;
}

/**
 * GitHub Codespaces forwards each port as its own subdomain
 * (e.g. `name-4200.app.github.dev`) served over 443 rather than as
 * `host:port`. Rewrite the client's port segment to the API port.
 * Returns `null` for hosts that don't use this scheme.
 */
function forwardedApiHost(hostname: string): string | null {
  const match = /^(.*)-\d+\.app\.github\.dev$/.exec(hostname);

  return match ? `${match[1]}-${API_PORT}.app.github.dev` : null;
}
