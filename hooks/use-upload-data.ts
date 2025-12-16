import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { AxiosProgressEvent } from "axios";

interface UseUploadDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
  onSuccess?: (data: T, variables: D, context: TContext) => void;
  onError?: (error: Error, variables: D, context: TContext | undefined) => void;
  options?: Omit<
    UseMutationOptions<T, Error, D, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export const useUploadData = <T, D = FormData, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "File uploaded successfully",
  onUploadProgress,
  onSuccess,
  onError,
  options,
}: UseUploadDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, D, TContext>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post(url, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (onUploadProgress) {
            onUploadProgress(event);
          }
        },
      });
      return data.data;
    },
    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
      toast.success(successMessage);

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));

      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options,
  });
};
