"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { setAccessToken } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axiosInstance.post("/auth/refresh");
        setAccessToken(data.data.accessToken);
      } catch (err) {
        console.log("No active session found (User needs to login)");
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  if (isInitializing) {
    return <div>Loading session...</div>; // Atau spinner
  }

  return <>{children}</>;
}
