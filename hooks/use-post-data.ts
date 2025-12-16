import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface UsePostDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  onSuccess?: (data: T, variables: D, context: TContext) => void;
  onError?: (error: Error, variables: D, context: TContext | undefined) => void;
  options?: Omit<
    UseMutationOptions<T, Error, D, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export const usePostData = <T, D, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data created successfully",
  onSuccess,
  onError,
  options,
}: UsePostDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, D, TContext>({
    mutationFn: async (payload) => {
      const isFormData = payload instanceof FormData;
      const { data } = await axiosInstance.post(url, payload, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });
      return data.data;
    },
    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      if (successMessage) {
        toast.success(successMessage);
      }

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
