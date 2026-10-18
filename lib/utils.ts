import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ACCESS_TOKEN_KEY = "accessToken";
export const AUTH_SYNC_STORAGE_KEY = "gunasmash:auth-sync";

export const setAccessToken = (token: string | null) => {
  if (token) {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      expires: 1 / 96,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } else {
    Cookies.remove(ACCESS_TOKEN_KEY);
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        AUTH_SYNC_STORAGE_KEY,
        `${token ? "signed-in" : "signed-out"}:${Date.now()}:${Math.random()}`
      );
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error?.message ||
      error.message ||
      "An error occurred on the server"
    );
  }
  return "An unknown error occurred";
};
