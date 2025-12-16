"use client";

import * as React from "react";
import { useGetData } from "@/hooks/use-get-data";
import { DataTable } from "@/components/ui/data-table/data-table";
import { sessionColumns, Session } from "./session-columns";
import { DataTableFilterField } from "@/components/ui/data-table/data-table-toolbar";
import { Lock, LockOpen, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginationState, ColumnFiltersState } from "@tanstack/react-table";

interface SessionsApiResponse {
  items: Session[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function SessionDataTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const rawSearchTerm = React.useMemo(() => {
    const titleFilter = columnFilters.find((f) => f.id === "title");
    return String(titleFilter?.value || "");
  }, [columnFilters]);

  const debouncedSearch = useDebounce(rawSearchTerm, 500);

  const filterParams = React.useMemo(() => {
    const filterObj: Record<string, any> = {};
    columnFilters.forEach((filter) => {
      if (filter.value && filter.id !== "title") {
        filterObj[filter.id] = filter.value;
      }
    });
    return Object.keys(filterObj).length > 0
      ? JSON.stringify(filterObj)
      : undefined;
  }, [columnFilters]);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useGetData<SessionsApiResponse>({
    url: "/attendances",
    key: [
      "sessions",
      String(pagination.pageIndex),
      String(pagination.pageSize),
      filterParams || "",
      debouncedSearch,
    ],
    params: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch,
      filter: filterParams,
    },
  });

  const sessions = apiData?.items || [];

  const filters: DataTableFilterField<Session>[] = [
    {
      label: "Status",
      value: "status",
      options: [
        { label: "Open", value: "OPEN", icon: LockOpen },
        { label: "Closed", value: "CLOSED", icon: Lock },
      ],
    },
  ];

  const handleColumnFiltersChange = (
    updaterOrValue:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    setColumnFilters((old) => {
      let next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(old)
          : updaterOrValue;

      const newSearchValue = next.find((f) => f.id === "title")?.value || "";

      const oldSearchValue = old.find((f) => f.id === "title")?.value || "";

      if (
        newSearchValue !== oldSearchValue ||
        JSON.stringify(next) !== JSON.stringify(old)
      ) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }

      return next;
    });
  };

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;
  if (isError)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load sessions.</AlertDescription>
      </Alert>
    );

  return (
    <div className="bg-background">
      <DataTable
        columns={sessionColumns}
        data={sessions}
        searchKey="title"
        filters={filters}
        pageCount={apiData?.meta.pages || -1}
        pagination={pagination}
        onPaginationChange={setPagination}
        rowCount={apiData?.meta.total}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFiltersChange}
      />
    </div>
  );
}
