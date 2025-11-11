"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Calendar, Users, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CTAProps = {
  className?: string;
  backgroundUrl?: string;
  title?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  stats?: { value: string; label: string }[];
};

export function CTA({
  className,
  backgroundUrl,
  title = "Gabung Latihan GunaSmash",
  subtitle = "Latihan rutin, sparring seru, dan komunitas suportif menanti kamu. Daftar sekarang dan mulai tingkatkan permainanmu.",
  primaryHref = "/auth/sign-up",
  primaryLabel = "Daftar Anggota",
  secondaryHref = "/schedules",
  secondaryLabel = "Lihat Jadwal",
  stats = [
    { value: "200+", label: "Anggota Aktif" },
    { value: "2x / minggu", label: "Latihan Rutin" },
    { value: "2010", label: "Sejak" },
  ],
}: CTAProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 md:py-24",
        "bg-linear-to-b from-muted/40 to-background",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {backgroundUrl ? (
          <>
            <Image
              src={backgroundUrl}
              alt="Latar CTA"
              fill
              priority
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background/70 via-background/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(800px_200px_at_0%_-10%,hsl(var(--primary)/.12),transparent_60%)]" />
        )}
      </div>

      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-3xl border bg-linear-to-r from-primary/5 via-background to-background p-6 md:p-10">
          <div className="pointer-events-none absolute -inset-px opacity-100">
            <div className="absolute -inset-px bg-[radial-gradient(1200px_220px_at_0%_-10%,hsl(var(--primary)/.18),transparent_60%)]" />
          </div>

          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge variant="secondary" className="mb-3">
                Ayo Bergabung
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl">{subtitle}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-xl px-6">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-6 bg-background/70 backdrop-blur"
                >
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl border bg-linear-to-b from-muted/40 to-background px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="text-2xl font-extrabold tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Rabu & Minggu
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Terbuka semua jurusan
                </span>
                <span className="inline-flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Siap ke turnamen
                </span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border bg-linear-to-br from-muted/40 to-background">
                {backgroundUrl ? (
                  <Image
                    src={backgroundUrl}
                    alt="Ilustrasi kegiatan"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-2xl border bg-background/70 px-6 py-8 text-center backdrop-blur">
                      <div className="text-2xl font-bold">GunaSmash</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Latihan. Sparring. Bertumbuh.
                      </p>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
