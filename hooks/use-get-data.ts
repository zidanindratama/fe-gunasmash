import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

interface UseGetDataProps<T> {
  key: string[];
  url: string;
  params?: Record<string, any>;
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;
}

export const useGetData = <T>({
  key,
  url,
  params,
  options,
}: UseGetDataProps<T>) => {
  return useQuery<T, Error>({
    queryKey: params ? [...key, params] : key,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, { params });
      return data.data;
    },
    ...options,
  });
};
