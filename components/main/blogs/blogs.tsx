"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Tag, Calendar, ArrowRight } from "lucide-react";
import api from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
};

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type ListMeta = { total: number; page: number; limit: number; pages?: number };
type ListShape<T> =
  | { items: T[]; meta: ListMeta }
  | { items: T[]; total: number; page: number; limit: number; pages?: number };

function normalizeList<T>(data: any): { items: T[]; meta: ListMeta } {
  if (data?.meta && Array.isArray(data?.items))
    return { items: data.items as T[], meta: data.meta as ListMeta };
  if (Array.isArray(data?.items)) {
    const total = Number(data.total ?? data.items.length);
    const page = Number(data.page ?? 1);
    const limit = Number(data.limit ?? data.items.length);
    const pages = Number.isFinite(Number(data.pages))
      ? Number(data.pages)
      : Math.max(1, Math.ceil(total / Math.max(1, limit)));
    return { items: data.items as T[], meta: { total, page, limit, pages } };
  }
  return { items: [], meta: { total: 0, page: 1, limit: 10, pages: 1 } };
}

function BlogCard({ data }: { data: Blog }) {
  const d = new Date(data.createdAt);
  return (
    <Card className="group relative flex h-full max-w-none flex-col overflow-hidden rounded-3xl border bg-background/80 shadow-none ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20">
      <CardHeader className="px-5 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(d)}
          </span>
          {data.published ? (
            <Badge variant="outline" className="shrink-0">
              Published
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              Draft
            </Badge>
          )}
        </div>
        <h3 className="text-base font-semibold leading-snug">
          <Link
            href={`/blogs/${data.slug}`}
            className="line-clamp-2 hover:underline"
          >
            {data.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="px-5">
        {data.coverUrl ? (
          <div className="relative overflow-hidden rounded-2xl">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={data.coverUrl}
                alt={data.title}
                fill
                className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.98]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority
              />
            </AspectRatio>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-background/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-muted" />
        )}
        <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
          {data.content}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {data.tags.map((t) => (
            <span
              key={t}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
                "bg-muted/50 text-foreground/80 border-border/60"
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              {t}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-3 flex items-center justify-between px-5 pb-5 pt-0">
        <Button asChild>
          <Link
            href={`/blogs/${data.slug}`}
            className="inline-flex items-center gap-2"
          >
            Baca <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
    </Card>
  );
}

function Toolbar({
  q,
  onQ,
  tag,
  onTag,
  pub,
  onPub,
  sort,
  onSort,
  tagOptions,
}: {
  q: string;
  onQ: (v: string) => void;
  tag: string | "ALL";
  onTag: (v: string | "ALL") => void;
  pub: "all" | "published" | "draft";
  onPub: (v: "all" | "published" | "draft") => void;
  sort: "newest" | "oldest" | "title";
  onSort: (v: "newest" | "oldest" | "title") => void;
  tagOptions: string[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Cari judul, isi, atau tag..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={tag} onValueChange={(v) => onTag(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Tag</SelectItem>
            {tagOptions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={pub} onValueChange={(v) => onPub(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSort(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="title">Judul A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

async function fetchBlogs(params: {
  q: string;
  tag: string | "ALL";
  pub: "all" | "published" | "draft";
  sort: "newest" | "oldest" | "title";
  page: number;
  limit: number;
}): Promise<{ items: Blog[]; meta: ListMeta }> {
  const qp: Record<string, string> = {
    page: String(params.page),
    limit: String(params.limit),
  };
  if (params.q.trim()) qp.q = params.q.trim();
  if (params.tag !== "ALL") qp.tag = params.tag;
  if (params.pub !== "all")
    qp.published = params.pub === "published" ? "true" : "false";
  if (params.sort === "title") {
    qp.sortBy = "title";
    qp.sortDir = "asc";
  } else if (params.sort === "oldest") {
    qp.sortBy = "createdAt";
    qp.sortDir = "asc";
  } else {
    qp.sortBy = "createdAt";
    qp.sortDir = "desc";
  }
  const res = await api.get<ApiResponse<ListShape<Blog>>>("/api/blogs", {
    params: qp,
  });
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Failed to fetch blogs");
  return normalizeList<Blog>(res.data.data);
}

async function fetchBlogTags(): Promise<string[]> {
  const res = await api.get<ApiResponse<ListShape<Pick<Blog, "tags">>>>(
    "/api/blogs",
    {
      params: { page: 1, limit: 200, sortBy: "createdAt", sortDir: "desc" },
    }
  );
  if (!("success" in res.data) || !res.data.success) return [];
  const { items } = normalizeList<Pick<Blog, "tags">>(res.data.data);
  const set = new Set<string>();
  items.forEach((b) => b.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export default function Blogs() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [tag, setTag] = React.useState<string | "ALL">(
    (sp.get("tag") as string) || "ALL"
  );
  const [pub, setPub] = React.useState<"all" | "published" | "draft">(
    (sp.get("pub") as any) || "all"
  );
  const [sort, setSort] = React.useState<"newest" | "oldest" | "title">(
    (sp.get("sort") as any) || "newest"
  );
  const [page, setPage] = React.useState<number>(
    Number(sp.get("page") ?? "1") || 1
  );
  const pageSize = 9;

  const { data: tagsData } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: fetchBlogTags,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["blogs", q, tag, pub, sort, page, pageSize],
    queryFn: () => fetchBlogs({ q, tag, pub, sort, page, limit: pageSize }),
  });

  const items = data?.items ?? [];
  const totalPages =
    data?.meta?.pages ??
    Math.max(1, Math.ceil((data?.meta?.total ?? 0) / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q);
    if (tag !== "ALL") params.set("tag", tag);
    if (pub !== "all") params.set("pub", pub);
    if (sort !== "newest") params.set("sort", sort);
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/blogs?${qs}` : "/blogs");
  }, [q, tag, pub, sort, page, router]);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            Blog
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Artikel & Wawasan GunaSmash
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tips latihan, strategi, perlengkapan, dan cerita seputar
            bulutangkis.
          </p>
        </div>

        <Card className="mb-6 rounded-3xl">
          <CardContent className="py-6">
            <Toolbar
              q={q}
              onQ={(v) => {
                setPage(1);
                setQ(v);
              }}
              tag={tag}
              onTag={(v) => {
                setPage(1);
                setTag(v);
              }}
              pub={pub}
              onPub={(v) => {
                setPage(1);
                setPub(v);
              }}
              sort={sort}
              onSort={(v) => {
                setPage(1);
                setSort(v);
              }}
              tagOptions={tagsData ?? []}
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i} className="h-full rounded-3xl">
                <CardHeader className="px-5 py-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent className="px-5">
                  <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <BlogCard key={b.id} data={b} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/40 p-10 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tidak ada artikel yang cocok dengan filter saat ini.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  aria-disabled={safePage <= 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  aria-disabled={safePage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
