import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface PatchVariables<D> {
  slug?: string | number;
  data: D;
}

interface UsePatchDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  onSuccess?: (
    data: T,
    variables: PatchVariables<D>,
    context: TContext
  ) => void;
  onError?: (
    error: Error,
    variables: PatchVariables<D>,
    context: TContext | undefined
  ) => void;
  options?: Omit<
    UseMutationOptions<T, Error, PatchVariables<D>, TContext>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export const usePatchData = <T, D, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data updated successfully",
  onSuccess,
  onError,
  options,
}: UsePatchDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PatchVariables<D>, TContext>({
    mutationFn: async ({ slug, data: payload }) => {
      const finalUrl = slug ? `${url}/${slug}` : url;
      const isFormData = payload instanceof FormData;

      const { data } = await axiosInstance.patch(finalUrl, payload, {
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
