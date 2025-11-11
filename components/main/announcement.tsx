"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Shapes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

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

const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Latihan Rutin Rabu Sore",
    datetime: "2025-11-05T15:00:00+07:00",
    location: "Sport Center Kampus H",
    type: "TRAINING",
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a2",
    title: "Sparring Persiapan Turnamen",
    datetime: "2025-11-09T11:00:00+07:00",
    location: "GOR Gloria",
    type: "SPARRING",
    imageUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a3",
    title: "Briefing Panitia Internal Cup",
    datetime: "2025-11-07T19:00:00+07:00",
    location: "Ruang Rapat BEM",
    type: "BRIEFING",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a4",
    title: "Open Recruitment Anggota Baru",
    datetime: "2025-11-12T10:00:00+07:00",
    location: "Kampus H Lobby",
    type: "RECRUITMENT",
    imageUrl:
      "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1200&auto=format&fit=crop",
  },
];

function formatDateBits(dt: string) {
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

function typeStyle(t: AnnType) {
  const base =
    "shrink-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-lg";
  switch (t) {
    case "TRAINING":
      return {
        label: "Training",
        className: cn(
          base,
          "bg-emerald-600/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900/50"
        ),
      };
    case "SPARRING":
      return {
        label: "Sparring",
        className: cn(
          base,
          "bg-indigo-600/10 text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-900/50"
        ),
      };
    case "TOURNAMENT":
      return {
        label: "Tournament",
        className: cn(
          base,
          "bg-orange-600/10 text-orange-700 border-orange-200 dark:text-orange-300 dark:border-orange-900/50"
        ),
      };
    case "BRIEFING":
      return {
        label: "Briefing",
        className: cn(
          base,
          "bg-sky-600/10 text-sky-700 border-sky-200 dark:text-sky-300 dark:border-sky-900/50"
        ),
      };
    case "RECRUITMENT":
      return {
        label: "Recruitment",
        className: cn(
          base,
          "bg-fuchsia-600/10 text-fuchsia-700 border-fuchsia-200 dark:text-fuchsia-300 dark:border-fuchsia-900/50"
        ),
      };
    case "EVENT":
      return {
        label: "Event",
        className: cn(
          base,
          "bg-rose-600/10 text-rose-700 border-rose-200 dark:text-rose-300 dark:border-rose-900/50"
        ),
      };
    case "INFO":
    default:
      return {
        label: "Info",
        className: cn(
          base,
          "bg-zinc-600/10 text-zinc-700 border-zinc-200 dark:text-zinc-300 dark:border-zinc-900/50"
        ),
      };
  }
}

function AnnouncementCard({ data }: { data: Announcement }) {
  const { day, mon, wk, time, date } = formatDateBits(data.datetime);
  const isThisWeek = withinThisWeek(date);
  const ts = typeStyle(data.type);

  return (
    <Card className="group relative flex h-full max-w-none flex-col overflow-hidden rounded-3xl border bg-background/80 shadow-none ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20">
      <CardHeader className="flex flex-row items-center gap-3 px-5 py-4 text-base font-semibold">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Shapes className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <h3 className="line-clamp-1">{data.title}</h3>
          <div className="flex items-center gap-2">
            <span className={ts.className}>{ts.label}</span>
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

function AnnouncementSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl">
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
  );
}

export function AnnouncementSection({
  className,
  initialCount = 3,
}: {
  className?: string;
  initialCount?: number;
}) {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Announcement[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const sorted = [...mockAnnouncements].sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
      setItems(sorted.slice(0, Math.max(1, initialCount)));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [initialCount]);

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Pengumuman Terbaru
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informasi latihan, sparring, dan kegiatan mendatang.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/announcements">Lihat Semua</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: initialCount }).map((_, i) => (
              <AnnouncementSkeleton key={i} />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <AnnouncementCard key={a.id} data={a} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            Belum ada pengumuman.
          </div>
        )}
      </div>
    </section>
  );
}
