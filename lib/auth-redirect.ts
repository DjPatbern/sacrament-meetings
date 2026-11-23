export function normalizeAuthRedirect(value: unknown): string {
  const requestedPath = String(value ?? "/meetings");

  if (requestedPath.startsWith("/") && !requestedPath.startsWith("//")) {
    return requestedPath;
  }

  try {
    const url = new URL(requestedPath);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/meetings";
  }
}
