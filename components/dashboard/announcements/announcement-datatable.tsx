"use client";

import * as React from "react";
import { useGetData } from "@/hooks/use-get-data";
import { DataTable } from "@/components/ui/data-table/data-table";
import { announcementColumns, Announcement } from "./announcement-columns";
import { DataTableFilterField } from "@/components/ui/data-table/data-table-toolbar";
import {
  AlertCircle,
  CalendarRange,
  Swords,
  Trophy,
  Megaphone,
  UserPlus,
  PartyPopper,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginationState, ColumnFiltersState } from "@tanstack/react-table";

interface AnnouncementsApiResponse {
  items: Announcement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function AnnouncementDataTable() {
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
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
  } = useGetData<AnnouncementsApiResponse>({
    url: "/announcements",
    key: [
      "announcements",
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

  const announcements = apiData?.items || [];

  const filters: DataTableFilterField<Announcement>[] = [
    {
      label: "Type",
      value: "type",
      options: [
        { label: "Training", value: "TRAINING", icon: CalendarRange },
        { label: "Sparring", value: "SPARRING", icon: Swords },
        { label: "Tournament", value: "TOURNAMENT", icon: Trophy },
        { label: "Briefing", value: "BRIEFING", icon: Megaphone },
        { label: "Recruitment", value: "RECRUITMENT", icon: UserPlus },
        { label: "Event", value: "EVENT", icon: PartyPopper },
        { label: "Info", value: "INFO", icon: Info },
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

  if (isLoading) return <AnnouncementTableSkeleton />;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch announcements.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-background">
      <DataTable
        columns={announcementColumns}
        data={announcements}
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

function AnnouncementTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="border rounded-md">
        <div className="h-12 border-b bg-muted/50" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center p-4 space-x-4">
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
