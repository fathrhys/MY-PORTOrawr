"use client";

export function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function withCsrfHeaders(headers?: HeadersInit) {
  const token = getCsrfToken();
  return { ...(headers || {}), "x-csrf-token": token };
}
