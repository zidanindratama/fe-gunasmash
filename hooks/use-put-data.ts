import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface PutVariables<D> {
  slug?: string | number;
  data: D;
}

interface UsePutDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  onSuccess?: (data: T, variables: PutVariables<D>, context: TContext) => void;
  onError?: (
    error: Error,
    variables: PutVariables<D>,
    context: TContext | undefined
  ) => void;
  options?: Omit<
    UseMutationOptions<T, Error, PutVariables<D>, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export const usePutData = <T, D, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data saved successfully",
  onSuccess,
  onError,
  options,
}: UsePutDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PutVariables<D>, TContext>({
    mutationFn: async ({ slug, data: payload }) => {
      const finalUrl = slug ? `${url}/${slug}` : url;
      const isFormData = payload instanceof FormData;

      const { data } = await axiosInstance.put(finalUrl, payload, {
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
