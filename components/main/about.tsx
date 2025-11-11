"use client";

import * as React from "react";
import Image from "next/image";
import { Trophy, Users, Target, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AboutSectionProps = {
  className?: string;
  imageUrl?: string;
};

function FeatureCard({
  icon,
  title,
  desc,
  kpi,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  kpi?: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-linear-to-b from-muted/40 to-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-px bg-[radial-gradient(1200px_200px_at_0%_-10%,hsl(var(--primary)/.25),transparent_60%)]" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/80 backdrop-blur">
            {icon}
          </span>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{desc}</p>
        {kpi ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-md">
              {kpi}
            </Badge>
            <span className="text-xs text-muted-foreground">terverifikasi</span>
          </div>
        ) : null}
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
    </Card>
  );
}

export function About({ className, imageUrl }: AboutSectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-2 md:items-center">
        <div>
          <Badge variant="secondary" className="mb-3">
            Tentang GunaSmash
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            UKM Bulutangkis Universitas Gunadarma
          </h2>
          <p className="mt-4 text-muted-foreground">
            GunaSmash adalah komunitas bulutangkis di Universitas Gunadarma.
            Kami memfasilitasi latihan rutin, uji tanding, dan persiapan
            turnamen dengan kurikulum yang jelas. Fokusnya: konsisten berlatih,
            bertumbuh bersama, dan menjunjung sportivitas.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Komunitas Aktif"
              desc="200+ anggota lintas jurusan, terbuka untuk pemula hingga pemain berpengalaman."
              kpi="200+ anggota"
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5 text-primary" />}
              title="Jadwal Teratur"
              desc="Latihan mingguan berisi teknik, footwork, dan match play terstruktur."
              kpi="2x per minggu"
            />
            <FeatureCard
              icon={<Target className="h-5 w-5 text-primary" />}
              title="Pembinaan"
              desc="Program bertahap: fundamental, penguatan, hingga taktik pertandingan."
            />
            <FeatureCard
              icon={<Trophy className="h-5 w-5 text-primary" />}
              title="Kompetisi"
              desc="Partisipasi turnamen internal dan eksternal tingkat kampus."
            />
          </div>

          <Separator className="my-8" />

          <div className="mt-10 flex flex-col gap-8 sm:gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { value: "2010", label: "Tahun Berdiri" },
                { value: "200+", label: "Anggota Aktif" },
                { value: "2x / minggu", label: "Latihan Rutin" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border bg-linear-to-b from-muted/40 to-background px-6 py-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="text-3xl font-extrabold tracking-tight text-foreground">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-linear-to-r from-primary/5 via-background to-background p-6 backdrop-blur">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  Siap bergabung bersama kami?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ayo latihan di{" "}
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    Kampus H &amp; GOR sekitar
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" className="rounded-xl px-6">
                  Bergabung Sekarang
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl px-6">
                  Lihat Kegiatan
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border bg-linear-to-br from-muted/40 to-background">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Kegiatan latihan GunaSmash"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-2xl border bg-background/60 p-6 backdrop-blur">
                <Trophy className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Tambahkan foto kegiatan untuk melengkapi profil.
                </p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />
        </div>
      </div>
    </section>
  );
}
