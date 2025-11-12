"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Swords,
  Trophy,
  Megaphone,
  Info,
  MoveRight,
} from "lucide-react";
import api from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

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
  content?: string | null;
};

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

const TYPE_META: Record<
  AnnType,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  TRAINING: {
    label: "Training",
    badgeClass: cn(
      "border bg-emerald-600/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900/50"
    ),
    icon: <Users className="h-4 w-4" />,
  },
  SPARRING: {
    label: "Sparring",
    badgeClass: cn(
      "border bg-indigo-600/10 text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-900/50"
    ),
    icon: <Swords className="h-4 w-4" />,
  },
  TOURNAMENT: {
    label: "Tournament",
    badgeClass: cn(
      "border bg-orange-600/10 text-orange-700 border-orange-200 dark:text-orange-300 dark:border-orange-900/50"
    ),
    icon: <Trophy className="h-4 w-4" />,
  },
  BRIEFING: {
    label: "Briefing",
    badgeClass: cn(
      "border bg-sky-600/10 text-sky-700 border-sky-200 dark:text-sky-300 dark:border-sky-900/50"
    ),
    icon: <Megaphone className="h-4 w-4" />,
  },
  RECRUITMENT: {
    label: "Recruitment",
    badgeClass: cn(
      "border bg-fuchsia-600/10 text-fuchsia-700 border-fuchsia-200 dark:text-fuchsia-300 dark:border-fuchsia-900/50"
    ),
    icon: <Users className="h-4 w-4" />,
  },
  EVENT: {
    label: "Event",
    badgeClass: cn(
      "border bg-rose-600/10 text-rose-700 border-rose-200 dark:text-rose-300 dark:border-rose-900/50"
    ),
    icon: <Megaphone className="h-4 w-4" />,
  },
  INFO: {
    label: "Info",
    badgeClass: cn(
      "border bg-zinc-600/10 text-zinc-700 border-zinc-200 dark:text-zinc-300 dark:border-zinc-900/50"
    ),
    icon: <Info className="h-4 w-4" />,
  },
};

function fmtLong(dt: string) {
  const d = new Date(dt);
  return (
    new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d) + " WIB"
  );
}

function Shell({ item }: { item: Announcement }) {
  const meta = TYPE_META[item.type];
  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/announcements"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pengumuman
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">{item.title}</span>
        </div>
        <div className="mb-6">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
              meta.badgeClass
            )}
          >
            {meta.icon}
            {meta.label}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {fmtLong(item.datetime)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {item.location}
            </span>
          </div>
        </div>
        <Card className="overflow-hidden rounded-3xl">
          <CardHeader className="p-0">
            {item.imageUrl ? (
              <div className="relative">
                <AspectRatio ratio={16 / 7}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </AspectRatio>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-background/0 to-transparent" />
              </div>
            ) : (
              <div className="aspect-16/7 w-full bg-muted" />
            )}
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
              <article
                className="prose prose-zinc max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: item.content || "" }}
              />
              <div>
                <div className="rounded-2xl border">
                  <div className="p-5">
                    <div className="mb-4 text-sm font-semibold">Detail</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-4 w-4" />
                        <div>
                          <div className="text-foreground">Waktu</div>
                          <div className="text-muted-foreground">
                            {fmtLong(item.datetime)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4" />
                        <div>
                          <div className="text-foreground">Lokasi</div>
                          <div className="text-muted-foreground">
                            {item.location}
                          </div>
                          {item.locationLink ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="mt-2"
                            >
                              <Link
                                href={item.locationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Buka peta
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <CardFooter className="justify-between p-5">
                    <Button asChild variant="ghost">
                      <Link href="/announcements">Kembali</Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href="/auth/sign-up"
                        className="inline-flex items-center gap-2"
                      >
                        Gabung <MoveRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

async function fetchAnnouncement(id: string): Promise<Announcement> {
  const res = await api.get<
    ApiResponse<{
      id: string;
      title: string;
      type: AnnType;
      datetime: string;
      location: string;
      locationLink?: string | null;
      imageUrl?: string | null;
      content?: string | null;
    }>
  >(`/api/announcements/${id}`);
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Failed to fetch");
  const a = res.data.data;
  return {
    id: a.id,
    title: a.title,
    type: a.type,
    datetime: a.datetime,
    location: a.location,
    locationLink: a.locationLink ?? null,
    imageUrl: a.imageUrl ?? null,
    content: a.content ?? null,
  };
}

export default function AnnouncementDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["announcement", id],
    queryFn: () => fetchAnnouncement(id),
    retry: (count, err: any) => {
      if (err?.response?.status === 404) return false;
      return count < 2;
    },
  });

  React.useEffect(() => {
    if (!isLoading && isError && (error as any)?.response?.status === 404)
      router.replace("/announcements");
  }, [isLoading, isError, error, router]);

  if (isLoading) {
    return (
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-3 h-10 w-2/3" />
            <div className="mt-3 flex gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Card className="overflow-hidden rounded-3xl">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="rounded-2xl border p-5">
                  <Skeleton className="h-5 w-24 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return <Shell item={data} />;
}
