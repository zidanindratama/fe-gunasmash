"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Quote, Youtube, Twitter, Instagram } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Social =
  | { type: "youtube"; url: string }
  | { type: "twitter"; url: string }
  | { type: "instagram"; url: string };

type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  rating?: number;
  avatarUrl?: string | null;
  highlight?: string;
};

const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Andika Putra",
    role: "Teknik Informatika ‘23 • Single Player",
    message:
      "Latihan di GunaSmash tuh rapi dan progresnya kerasa. Footwork, drill, sampai match play-nya jelas. Komunitasnya juga suportif banget.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
  },
  {
    id: "t2",
    name: "Mawar Salsabila",
    role: "Sistem Informasi ‘22 • Ganda Putri",
    message:
      "Coach-nya sabar, materinya bertahap. Cocok buat pemula tapi tetap menantang buat yang sudah main lama.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    id: "t3",
    name: "Rizky Akbar",
    role: "Manajemen ‘21 • Ganda Campuran",
    message:
      "Jadwalnya konsisten, sparring-nya seru, dan banyak temen baru lintas jurusan. Fasilitasnya juga oke!",
    rating: 4,
    avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
  },
];

function RatingStars({
  value = 0,
  className,
}: {
  value?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              filled ? "fill-primary text-primary" : "text-muted-foreground/50"
            )}
          />
        );
      })}
    </div>
  );
}

function Highlight({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === (highlight || "").toLowerCase() ? (
          <mark
            key={i}
            className="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary ring-1 ring-primary/20"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="group relative h-full overflow-hidden rounded-3xl border bg-linear-to-b from-muted/40 to-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-px bg-[radial-gradient(1000px_160px_at_0%_-10%,hsl(var(--primary)/.18),transparent_60%)]" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 shrink-0 ring-1 ring-border">
            {t.avatarUrl ? (
              <AvatarImage
                src={t.avatarUrl}
                alt={t.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="h-full w-full">
                {t.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-base leading-tight">{t.name}</CardTitle>
            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {t.role}
            </div>
          </div>
          {typeof t.rating === "number" ? (
            <Badge variant="secondary" className="ml-auto rounded-md">
              {t.rating.toFixed(1)}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {typeof t.rating === "number" ? <RatingStars value={t.rating} /> : null}

        <div className="relative rounded-2xl border bg-background/70 p-4">
          <Quote className="absolute -top-3 -left-3 h-6 w-6 rounded-full border bg-background p-1 text-primary" />
          <p className="text-sm text-muted-foreground">
            <Highlight text={t.message} highlight={t.highlight} />
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="ml-auto text-[11px] uppercase tracking-wide text-muted-foreground">
          Testimoni Anggota
        </div>
      </CardFooter>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
    </Card>
  );
}

function TestimonialSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-3xl">
      <div className="flex items-start gap-3 px-5 pt-5">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
        <Skeleton className="h-6 w-10 rounded-md" />
      </div>
      <div className="space-y-3 px-5 py-5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function Testimonial({
  className,
  initialCount = 3,
  items: propItems,
}: {
  className?: string;
  initialCount?: number;
  items?: Testimonial[];
}) {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Testimonial[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const data = (propItems?.length ? propItems : mockTestimonials).slice(
        0,
        Math.max(1, initialCount)
      );
      setItems(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [initialCount, propItems]);

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Testimoni Anggota
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cerita singkat dari anggota yang rutin berlatih di GunaSmash.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: initialCount }).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            Belum ada testimoni.
          </div>
        )}
      </div>
    </section>
  );
}
