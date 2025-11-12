"use client";
import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios-instance";

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type UploadOut = { url: string; publicId: string };

export function useUploadImageList() {
  const [progressMap, setProgressMap] = React.useState<Record<string, number>>(
    {}
  );

  const mutation = useMutation({
    mutationKey: ["upload-image-list"],
    mutationFn: async (files: File[]): Promise<UploadOut[]> => {
      const results: UploadOut[] = [];
      for (const file of files) {
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
              setProgressMap((m) => ({ ...m, [file.name]: p }));
            },
          }
        );
        if (!("success" in res.data) || !res.data.success)
          throw new Error("Upload gagal");
        results.push(res.data.data);
      }
      return results;
    },
    onSettled: () => setProgressMap({}),
  });

  return {
    uploadMany: mutation.mutateAsync,
    data: mutation.data,
    isUploading: mutation.isPending,
    error: mutation.error,
    progressMap,
    reset: mutation.reset,
  };
}
