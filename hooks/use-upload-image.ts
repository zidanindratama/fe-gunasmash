"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios-instance";

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type UploadOut = { url: string; publicId: string };

export function useUploadImage() {
  const [progress, setProgress] = React.useState(0);

  const mutation = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: async (file: File): Promise<UploadOut> => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<ApiResponse<UploadOut>>(
        "/api/uploads/image",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (!e.total) return;
            const p = Math.round((e.loaded / e.total) * 100);
            setProgress(p);
          },
        }
      );
      if (!("success" in res.data) || !res.data.success)
        throw new Error("Upload gagal");
      return res.data.data;
    },
    onSettled: () => setProgress(0),
  });

  return {
    upload: mutation.mutateAsync,
    data: mutation.data,
    isUploading: mutation.isPending,
    error: mutation.error,
    progress,
    reset: mutation.reset,
  };
}
