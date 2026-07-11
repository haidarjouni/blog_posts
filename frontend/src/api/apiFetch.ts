const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function buildApiUrl(path: string): string {
     if (path.startsWith("http")) {
          return path;
     }
     return `${API_URL}${path}`;
}

function isAuthEndpoint(path: string): boolean {
     return path.includes("/api/auth/login") || path.includes("/api/auth/refresh");
}

async function refreshSessionRequest(): Promise<boolean> {
     const response = await fetch(buildApiUrl("/api/auth/refresh"), {
          method: "POST",
          credentials: "include",
     });

     return response.ok;
}

export async function apiFetch(path: string, options: RequestInit = {}, retryAfterRefresh = true): Promise<Response> {
     const response = await fetch(buildApiUrl(path), {
          ...options,
          credentials: "include",
     });

     if (response.status !== 401 || !retryAfterRefresh || isAuthEndpoint(path)) {
          return response;
     }

     const refreshed = await refreshSessionRequest();

     if (!refreshed) {
          return response;
     }

     return fetch(buildApiUrl(path), {
          ...options,
          credentials: "include",
     });
}
