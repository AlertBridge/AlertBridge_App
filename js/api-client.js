/*
 * SafeCommunity API boundary for backend integration.
 * Set window.SC_API_CONFIG in a script before this file when the backend is ready:
 * window.SC_API_CONFIG = { baseUrl: "http://localhost:3000/api/v1" };
 * This module intentionally does not invent a server or silently fall back to mock data.
 */
(function () {
  const config = window.SC_API_CONFIG || { baseUrl: "http://localhost:3000/api/v1" };
  const TOKEN_KEY = "sc_access_token";

  async function request(path, options = {}) {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData) && options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers,
      body: options.body && typeof options.body !== "string" && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
      credentials: "include"
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
      const message = payload && typeof payload === "object" ? payload.message : "Request failed. Please try again.";
      const error = new Error(message || `Request failed (${response.status})`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  const api = {
    request,
    setToken(token) { if (token) sessionStorage.setItem(TOKEN_KEY, token); else sessionStorage.removeItem(TOKEN_KEY); },
    clearToken() { sessionStorage.removeItem(TOKEN_KEY); },
    auth: {
      register: data => request("/auth/register", { method: "POST", body: data }),
      login: data => request("/auth/login", { method: "POST", body: data }),
      logout: () => request("/auth/logout", { method: "POST" }),
      me: () => request("/auth/me"),
      forgotPassword: email => request("/auth/forgot-password", { method: "POST", body: { email } }),
      resetPassword: data => request("/auth/reset-password", { method: "POST", body: data })
    },
    profile: {
      get: () => request("/profile"),
      update: data => request("/profile", { method: "PATCH", body: data })
    },
    reports: {
      list: params => request(`/reports${params ? `?${new URLSearchParams(params)}` : ""}`),
      create: data => request("/reports", { method: "POST", body: data }),
      get: id => request(`/reports/${encodeURIComponent(id)}`),
      update: (id, data) => request(`/reports/${encodeURIComponent(id)}`, { method: "PATCH", body: data })
    },
    community: {
      listPosts: params => request(`/community/posts${params ? `?${new URLSearchParams(params)}` : ""}`),
      createPost: data => request("/community/posts", { method: "POST", body: data })
    },
    alerts: { list: () => request("/alerts") },
    notifications: {
      list: () => request("/notifications"),
      markRead: id => request(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
      markAllRead: () => request("/notifications/read-all", { method: "PATCH" })
    },
    tracker: {
      start: data => request("/tracker/start", { method: "POST", body: data }),
      checkIn: data => request("/tracker/check-ins", { method: "POST", body: data }),
      stop: data => request("/tracker/stop", { method: "POST", body: data }),
      current: () => request("/tracker/current")
    },
    emergency: {
      createAlert: data => request("/emergency/alerts", { method: "POST", body: data })
    }
  };
  window.SafeCommunityAPI = api;
})();
