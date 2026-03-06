export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8080`
    : "http://localhost:8080");

export const WS_BASE_URL =
  process.env.REACT_APP_WS_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.hostname
      }:8080`
    : "ws://localhost:8080");

export const IMAGE_BASE_URL =
  process.env.REACT_APP_IMAGE_BASE_URL || API_BASE_URL;
