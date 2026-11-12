const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = configuredApiUrl
  ? `${/^https?:\/\//i.test(configuredApiUrl) ? "" : "https://"}${configuredApiUrl}`.replace(/\/+$/, "")
  : "http://localhost:8080";

export const apiUrl = (path) => `${apiBaseUrl}${path}`;
