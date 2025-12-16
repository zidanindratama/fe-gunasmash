import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface UseDeleteDataProps<T, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  // Update tipe variables agar bisa string, number, atau undefined
  onSuccess?: (
    data: T,
    variables: string | number | undefined,
    context: TContext
  ) => void;
  onError?: (
    error: Error,
    variables: string | number | undefined,
    context: TContext | undefined
  ) => void;
  options?: Omit<
    UseMutationOptions<T, Error, string | number | undefined, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export const useDeleteData = <T, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data deleted successfully",
  onSuccess,
  onError,
  options,
}: UseDeleteDataProps<T, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, string | number | undefined, TContext>({
    mutationFn: async (id) => {
      const finalUrl = id ? `${url}/${id}` : url;

      const { data } = await axiosInstance.delete(finalUrl);
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
