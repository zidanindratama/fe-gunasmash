"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Shapes, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios-instance";

type AnnType =
  | "TRAINING"
  | "SPARRING"
  | "TOURNAMENT"
  | "BRIEFING"
  | "RECRUITMENT"
  | "EVENT"
  | "INFO";

type Announcement = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  type: AnnType;
  imageUrl?: string | null;
  locationLink?: string | null;
};

type ListResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

const TYPE_META: Record<AnnType, { label: string; className: string }> = {
  TRAINING: {
    label: "Training",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-emerald-600/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900/50"
    ),
  },
  SPARRING: {
    label: "Sparring",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-indigo-600/10 text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-900/50"
    ),
  },
  TOURNAMENT: {
    label: "Tournament",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-orange-600/10 text-orange-700 border-orange-200 dark:text-orange-300 dark:border-orange-900/50"
    ),
  },
  BRIEFING: {
    label: "Briefing",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-sky-600/10 text-sky-700 border-sky-200 dark:text-sky-300 dark:border-sky-900/50"
    ),
  },
  RECRUITMENT: {
    label: "Recruitment",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-fuchsia-600/10 text-fuchsia-700 border-fuchsia-200 dark:text-fuchsia-300 dark:border-fuchsia-900/50"
    ),
  },
  EVENT: {
    label: "Event",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-rose-600/10 text-rose-700 border-rose-200 dark:text-rose-300 dark:border-rose-900/50"
    ),
  },
  INFO: {
    label: "Info",
    className: cn(
      "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg",
      "bg-zinc-600/10 text-zinc-700 border-zinc-200 dark:text-zinc-300 dark:border-zinc-900/50"
    ),
  },
};

function formatBits(dt: string) {
  const d = new Date(dt);
  const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(d);
  const mon = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d);
  const wk = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return { day, mon, wk, time, date: d };
}

function withinThisWeek(date: Date) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function AnnouncementCard({ data }: { data: Announcement }) {
  const { day, mon, wk, time, date } = formatBits(data.datetime);
  const isThisWeek = withinThisWeek(date);
  const meta = TYPE_META[data.type];
  return (
    <Card className="group relative flex h-full max-w-none flex-col overflow-hidden rounded-3xl border bg-background/80 shadow-none ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20">
      <CardHeader className="flex flex-row items-center gap-3 px-5 py-4 text-base font-semibold">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Shapes className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <h3 className="line-clamp-1">{data.title}</h3>
          <div className="flex items-center gap-2">
            <span className={meta.className}>{meta.label}</span>
            {isThisWeek ? (
              <Badge variant="outline" className="shrink-0">
                Minggu Ini
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date)}{" "}
            WIB
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {data.location}
          </span>
        </div>
        {data.imageUrl ? (
          <div className="relative overflow-hidden rounded-2xl">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.98]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority
              />
            </AspectRatio>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-background/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <div className="rounded-xl border bg-background/85 px-2.5 py-1.5 text-xs backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-[11px] uppercase leading-none">
                      {mon}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {day}
                    </span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{wk}</span>
                    <span className="text-muted-foreground">{time} WIB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-muted" />
        )}
      </CardContent>
      <CardFooter className="mt-4 flex items-center justify-between px-5 pb-5 pt-0">
        <Button asChild>
          <Link
            href={`/announcements/${data.id}`}
            className="inline-flex items-center gap-2"
          >
            Detail <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        {data.locationLink ? (
          <Button asChild variant="ghost">
            <Link
              href={data.locationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka peta
            </Link>
          </Button>
        ) : null}
      </CardFooter>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
    </Card>
  );
}

function Toolbar({
  q,
  onQ,
  type,
  onType,
  sort,
  onSort,
}: {
  q: string;
  onQ: (v: string) => void;
  type: AnnType | "ALL";
  onType: (v: AnnType | "ALL") => void;
  sort: "newest" | "oldest" | "title";
  onSort: (v: "newest" | "oldest" | "title") => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Cari judul atau lokasi..."
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={type}
          onValueChange={(v) => onType(v as AnnType | "ALL")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Tipe</SelectItem>
            <SelectItem value="TRAINING">Training</SelectItem>
            <SelectItem value="SPARRING">Sparring</SelectItem>
            <SelectItem value="TOURNAMENT">Tournament</SelectItem>
            <SelectItem value="BRIEFING">Briefing</SelectItem>
            <SelectItem value="RECRUITMENT">Recruitment</SelectItem>
            <SelectItem value="EVENT">Event</SelectItem>
            <SelectItem value="INFO">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSort(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="title">Judul A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

async function fetchAnnouncements(params: {
  page: number;
  limit: number;
  q: string;
  type?: AnnType;
  sort: "newest" | "oldest" | "title";
}) {
  const sortBy = params.sort === "title" ? "title" : "datetime";
  const sortDir = params.sort === "oldest" ? "asc" : "desc";
  const res = await api.get<ApiResponse<ListResult<Announcement>>>(
    "/api/announcements",
    {
      params: {
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        type: params.type || undefined,
        sortBy,
        sortDir,
      },
    }
  );
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Failed to fetch");
  return res.data.data;
}

export default function Announcements() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [type, setType] = React.useState<AnnType | "ALL">(
    (sp.get("type") as AnnType) || "ALL"
  );
  const [sort, setSort] = React.useState<"newest" | "oldest" | "title">(
    (sp.get("sort") as any) || "newest"
  );
  const [page, setPage] = React.useState<number>(
    Number(sp.get("page") ?? "1") || 1
  );
  const pageSize = 9;

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q);
    if (type !== "ALL") params.set("type", type);
    if (sort !== "newest") params.set("sort", sort);
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/announcements?${qs}` : "/announcements");
  }, [q, type, sort, page, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["announcements", { q, type, sort, page, pageSize }],
    queryFn: () =>
      fetchAnnouncements({
        page,
        limit: pageSize,
        q,
        type: type === "ALL" ? undefined : (type as AnnType),
        sort,
      }),
    staleTime: 30_000,
  });

  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));
  const items = data?.items ?? [];

  React.useEffect(() => {
    setPage(1);
  }, [q, type, sort]);

  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            Pengumuman
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pengumuman Kegiatan GunaSmash
          </h1>
          <p className="mt-2 text-muted-foreground">
            Informasi latihan, sparring, turnamen, briefing, rekrutmen, dan
            acara lain.
          </p>
        </div>
        <Card className="mb-6 rounded-3xl">
          <CardContent className="py-6">
            <Toolbar
              q={q}
              onQ={(v) => setQ(v)}
              type={type}
              onType={(v) => setType(v)}
              sort={sort}
              onSort={(v) => setSort(v)}
            />
          </CardContent>
        </Card>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pageSize })
              .slice(0, 6)
              .map((_, i) => (
                <Card
                  key={i}
                  className="flex h-full flex-col overflow-hidden rounded-3xl"
                >
                  <div className="flex items-center gap-3 px-5 py-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <div className="px-5">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="mb-3 h-4 w-1/2" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                  </div>
                  <div className="flex items-center justify-between px-5 py-5">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                </Card>
              ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a: Announcement) => (
              <AnnouncementCard key={a.id} data={a} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/40 p-10 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tidak ada pengumuman yang cocok dengan filter saat ini.
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
                  aria-disabled={page <= 1}
                />
              </PaginationItem>
              {Array.from({ length: pages }).map((_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
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
                    setPage((p) => Math.min(pages, p + 1));
                  }}
                  aria-disabled={page >= pages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
