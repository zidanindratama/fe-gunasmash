"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogCard } from "@/components/main/blogs/blog-card";
import { Badge } from "@/components/ui/badge";
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
interface Option {
  label: string;
  value: string;
}

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface ListResponse {
  items: BlogItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const TAG_OPTIONS: Option[] = [
  { label: "News", value: "news" },
  { label: "Tips & Tricks", value: "tips" },
  { label: "Tutorial", value: "tutorial" },
  { label: "Gear Review", value: "gear" },
  { label: "Match Recap", value: "recap" },
  { label: "Health", value: "health" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Story", value: "story" },
];

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

export function BlogsView() {
  const [searchInput, setSearchInput] = useState("");
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const debouncedSearch = useDebounce(searchInput, 500);

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
      orderBy: JSON.stringify({ createdAt: sortOrder }),
      published: true,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (filterTag !== "ALL") {
      params.tag = filterTag;
    }

    return params;
  }, [currentPage, sortOrder, debouncedSearch, filterTag]);

  const { data: response, isLoading } = useGetData<ListResponse>({
    url: "/blogs",
    key: ["blogs-list", queryParams],
    params: queryParams,
  });

  const blogData = response?.items || [];
  const totalItems = response?.meta.total || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (newTag: string) => {
    setFilterTag(newTag);
    setCurrentPage(1);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const activeTagLabel =
    TAG_OPTIONS.find((opt) => opt.value === filterTag)?.label || filterTag;

  const renderSkeletons = () =>
    Array(pageSize)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="h-[450px] w-full bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
        >
          <Skeleton className="h-60 w-full" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ));

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-oswald text-5xl md:text-7xl uppercase font-bold mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Tips, tutorials, news, and stories from the Gunadarma Smash Club
            community.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
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

        {(searchInput || filterTag !== "ALL") && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">
              Active Filters:
            </span>
            {filterTag !== "ALL" && (
              <Badge variant="secondary" className="gap-1 pl-2">
                Tag: {activeTagLabel}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleTagChange("ALL")}
                />
              </Badge>
            )}
            {searchInput && (
              <Badge variant="secondary" className="gap-1 pl-2">
                Search: "{searchInput}"
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSearchInput("")}
                />
              </Badge>
            )}
            <Button
              variant="link"
              size="sm"
              className="text-xs h-auto p-0 ml-2"
              onClick={() => {
                setSearchInput("");
                setFilterTag("ALL");
                setCurrentPage(1);
              }}
            >
              Clear All
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderSkeletons()}
          </div>
        ) : blogData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.map((item) => (
              <BlogCard key={item.id} data={item as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground text-lg">
              No articles found matching your criteria.
            </p>
            <Button
              variant="link"
              className="text-primary mt-2"
              onClick={() => {
                setSearchInput("");
                setFilterTag("ALL");
                setCurrentPage(1);
              }}
            >
              Clear Filters
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
