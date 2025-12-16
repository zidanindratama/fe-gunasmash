"use client";

import * as React from "react";
import { useGetData } from "@/hooks/use-get-data";
import { DataTable } from "@/components/ui/data-table/data-table";
import { blogColumns, Blog } from "./blog-columns";
import { DataTableFilterField } from "@/components/ui/data-table/data-table-toolbar";
import { Globe, Lock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginationState, ColumnFiltersState } from "@tanstack/react-table";

interface BlogsApiResponse {
  items: {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverUrl?: string;
    tags: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function BlogDataTable() {
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
      if (filter.value && filter.id !== "title") {
        if (filter.id === "published") {
          filterObj[filter.id] = filter.value;
        } else {
          filterObj[filter.id] = filter.value;
        }
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
  } = useGetData<BlogsApiResponse>({
    url: "/blogs",
    key: [
      "blogs",
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

  const blogs: Blog[] =
    apiData?.items.map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      coverUrl: blog.coverUrl,
      published: blog.published,
      createdAt: blog.createdAt,
    })) || [];

  const filters: DataTableFilterField<Blog>[] = [
    {
      label: "Status",
      value: "published",
      options: [
        { label: "Published", value: "true", icon: Globe },
        { label: "Draft", value: "false", icon: Lock },
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

      const titleFilter = next.find((f) => f.id === "title");

      if (titleFilter) {
        setSearchTerm(String(titleFilter.value));
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
              <Skeleton className="h-12 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
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
          Failed to fetch blogs data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-background">
      <DataTable
        columns={blogColumns}
        data={blogs}
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
