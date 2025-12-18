import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ACCESS_TOKEN_KEY = "accessToken";

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
