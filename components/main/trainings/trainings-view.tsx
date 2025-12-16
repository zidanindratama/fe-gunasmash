"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/main/announcements/announcement-card";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
type AnnouncementType =
  | "TRAINING"
  | "SPARRING"
  | "TOURNAMENT"
  | "BRIEFING"
  | "RECRUITMENT"
  | "EVENT"
  | "INFO";

interface AnnouncementItem {
  id: string;
  title: string;
  type: AnnouncementType;
  datetime: string;
  location: string;
  locationLink: string | null;
  imageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface ListResponse {
  items: AnnouncementItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

interface SimplePaginationProps {
  total: number;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const SimplePagination = ({
  total,
  limit,
  page,
  onPageChange,
  isLoading,
}: SimplePaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isLoading}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isLoading}
      >
        Next
      </Button>
    </div>
  );
};

export function TrainingsView() {
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const debouncedSearch = useDebounce(searchInput, 500);

  const TRAINING_TYPES = ["TRAINING", "SPARRING"].join(",");

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
      orderBy: JSON.stringify({ datetime: sortOrder }),
      type: TRAINING_TYPES,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [currentPage, sortOrder, debouncedSearch]);

  const { data: response, isLoading } = useGetData<ListResponse>({
    url: "/announcements",
    key: ["trainings-list", queryParams],
    params: queryParams,
  });

  const trainingData = response?.items || [];
  const totalItems = response?.meta.total || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const renderSkeletons = () =>
    Array(pageSize)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden p-6 space-y-4"
        >
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      ));

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-oswald text-5xl md:text-7xl uppercase font-bold mb-4">
            Training <span className="text-primary">Schedules</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find upcoming training drills and sparring sessions to improve your
            skills.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or location..."
              className="pl-10 bg-background border-border/50"
              value={searchInput}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-[140px] bg-background border-border/50"
              onClick={handleSortChange}
              disabled={isLoading}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : trainingData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingData.map((item) => (
              <AnnouncementCard key={item.id} data={item as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground text-lg">
              No scheduled training sessions found matching your criteria.
            </p>
            <Button
              variant="link"
              className="text-primary mt-2"
              onClick={() => {
                setSearchInput("");
                setCurrentPage(1);
              }}
            >
              Clear Search
            </Button>
          </div>
        )}

        <SimplePagination
          total={totalItems}
          limit={pageSize}
          page={currentPage}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
