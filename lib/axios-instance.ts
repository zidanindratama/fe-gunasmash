import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000";
const REFRESH_ENDPOINT = "/api/auth/refresh";

type OkResponse<T> = { success: true; data: T; error?: never };
type ErrResponse = {
  success: false;
  error: { message: string; [k: string]: unknown };
  data?: never;
};
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type Role = "ADMIN" | "MEMBER";
export type User = { id: string; name: string; email: string; role: Role };

let accessToken: string | null = null;
const ACCESS_TOKEN_KEY = "access_token";

function loadTokenFromStorage() {
  try {
    const t =
      typeof window !== "undefined"
        ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (t) accessToken = t;
  } catch {}
}
function saveTokenToStorage(token: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
}

export function setAccessToken(token: string) {
  accessToken = token;
  saveTokenToStorage(token);
}
export function getAccessToken() {
  if (!accessToken) loadTokenFromStorage();
  return accessToken;
}
export function clearAccessToken() {
  accessToken = null;
  saveTokenToStorage(null);
}

let onUnauthorizedHandler: (() => void) | null = null;
export function onUnauthorized(cb: () => void) {
  onUnauthorizedHandler = cb;
}

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

const refresher: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
type Pending = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
const pendingQueue: Pending[] = [];

function queueRefresh(): Promise<string> {
  return new Promise((resolve, reject) => {
    pendingQueue.push({ resolve, reject });
  });
}
function flushQueue(error: unknown | null, token?: string) {
  while (pendingQueue.length) {
    const p = pendingQueue.shift()!;
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  }
}

async function doRefresh(): Promise<{ accessToken: string; user: User }> {
  const res = await refresher.post<
    ApiResponse<{ accessToken: string; user: User }>
  >(REFRESH_ENDPOINT, {});
  if (!res.data?.success)
    throw new Error(res.data?.error?.message || "Refresh failed");
  return res.data.data;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;
    if (
      !original ||
      status !== 401 ||
      (original.url || "").includes(REFRESH_ENDPOINT)
    )
      throw error;
    if (original._retry) {
      clearAccessToken();
      onUnauthorizedHandler?.();
      throw error;
    }
    original._retry = true;
    try {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { accessToken: newToken } = await doRefresh();
          setAccessToken(newToken);
          flushQueue(null, newToken);
          original.headers = original.headers || {};
          (
            original.headers as Record<string, string>
          ).Authorization = `Bearer ${newToken}`;
          return api.request(original);
        } catch (refreshErr) {
          flushQueue(refreshErr);
          clearAccessToken();
          onUnauthorizedHandler?.();
          throw refreshErr;
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await queueRefresh();
        original.headers = original.headers || {};
        (
          original.headers as Record<string, string>
        ).Authorization = `Bearer ${newToken}`;
        return api.request(original);
      }
    } catch (e) {
      throw e;
    }
  }
);

export async function signIn(email: string, password: string) {
  const res = await api.post<ApiResponse<{ accessToken: string; user: User }>>(
    "/api/auth/sign-in",
    { email, password },
    { withCredentials: true }
  );
  if (!res.data.success)
    throw new Error(res.data.error.message || "Sign-in failed");
  setAccessToken(res.data.data.accessToken);
  return res.data.data;
}

export async function signUp(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post<ApiResponse<{ accessToken: string; user: User }>>(
    "/api/auth/sign-up",
    payload,
    { withCredentials: true }
  );
  if (!res.data.success)
    throw new Error(res.data.error.message || "Sign-up failed");
  setAccessToken(res.data.data.accessToken);
  return res.data.data;
}

export async function logout() {
  try {
    await api.delete<ApiResponse<{}>>("/api/auth/logout", {
      withCredentials: true,
    });
  } finally {
    clearAccessToken();
  }
}

export default api;
