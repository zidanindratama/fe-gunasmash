"use client";

import * as React from "react";
import { useGetData } from "@/hooks/use-get-data";
import { DataTable } from "@/components/ui/data-table/data-table";
import { memberColumns, Member } from "./member-columns";
import { DataTableFilterField } from "@/components/ui/data-table/data-table-toolbar";
import { UserCog, Circle, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginationState, ColumnFiltersState } from "@tanstack/react-table";

interface UsersApiResponse {
  items: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    avatarUrl?: string;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function MemberDataTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);

      if (searchTerm !== debouncedSearch) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filterParams = React.useMemo(() => {
    const filterObj: Record<string, any> = {};
    columnFilters.forEach((filter) => {
      if (filter.value && filter.id !== "name") {
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
  } = useGetData<UsersApiResponse>({
    url: "/users",
    key: [
      "users",
      String(pagination.pageIndex),
      String(pagination.pageSize),
      filterParams || "",
      debouncedSearch,
    ],
    params: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      filter: filterParams,
      search: debouncedSearch,
    },
  });

  const members: Member[] =
    apiData?.items.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      lastActive: "-",
    })) || [];

  const filters: DataTableFilterField<Member>[] = [
    {
      label: "Role",
      value: "role",
      options: [
        { label: "Admin", value: "ADMIN", icon: UserCog },
        { label: "Member", value: "MEMBER", icon: undefined },
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

      const nameFilter = next.find((f) => f.id === "name");

      if (nameFilter) {
        setSearchTerm(String(nameFilter.value));
      } else {
        if (searchTerm !== "") setSearchTerm("");
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b bg-muted/50" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center p-4 space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch members data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-background">
      <DataTable
        columns={memberColumns}
        data={members}
        searchKey="name"
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
