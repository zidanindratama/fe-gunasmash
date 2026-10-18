"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import {
  AUTH_SYNC_STORAGE_KEY,
  getAccessToken,
  setAccessToken,
} from "@/lib/utils";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/member");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isProtectedRoute) {
      setIsAuthorized(false);
      return;
    }

    let active = true;
    const restoreSession = async () => {
      const accessToken = getAccessToken();

      try {
        const response = accessToken
          ? null
          : await axiosInstance.post("/auth/refresh");
        const user = response?.data?.data?.user;
        const role = user?.role;
        const requiredRole = pathname.startsWith("/dashboard") ? "ADMIN" : "MEMBER";

        if (!accessToken) {
          const refreshedToken = response?.data?.data?.accessToken;
          if (!refreshedToken) throw new Error("Session could not be restored");
          setAccessToken(refreshedToken);
        }

        if (role && role !== requiredRole) {
          router.replace("/unauthorized");
          return;
        }

        if (active) setIsAuthorized(true);
      } catch {
        setAccessToken(null);
        router.replace("/unauthorized");
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, [isProtectedRoute, pathname, router]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_SYNC_STORAGE_KEY) return;

      queryClient.clear();

      if (!isProtectedRoute) return;

      setIsAuthorized(false);
      const accessToken = getAccessToken();
      if (!accessToken) {
        router.replace("/unauthorized");
        return;
      }

      const requiredRole = pathname.startsWith("/dashboard")
        ? "ADMIN"
        : "MEMBER";

      void axiosInstance
        .get("/auth/me")
        .then((response) => {
          const role = response.data?.data?.role;
          if (role !== requiredRole) {
            router.replace("/unauthorized");
            return;
          }
          setIsAuthorized(true);
        })
        .catch(() => {
          router.replace("/unauthorized");
        });
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isProtectedRoute, pathname, queryClient, router]);

  if (isProtectedRoute && !isAuthorized) {
    return <div role="status">Loading session...</div>;
  }

  return <>{children}</>;
}
