"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutHero({ heroImageUrl }: { heroImageUrl?: string }) {
  return (
    <section
      id="about-hero"
      className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24"
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge variant="secondary">Tentang Kami</Badge>
          <h1 className="mt-3 font-extrabold leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            GunaSmash Badminton Club
          </h1>
          <p className="mt-5 text-muted-foreground max-w-2xl">
            Komunitas bulutangkis Universitas Gunadarma yang fokus pada latihan
            terstruktur, sportivitas, dan perkembangan anggota dari pemula
            hingga siap bertanding.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl px-6">
              <Link href="/auth/sign-up">
                Daftar Anggota
                <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl px-6 bg-background/70 backdrop-blur"
            >
              <Link href="/schedules">Lihat Jadwal</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: "2010", label: "Tahun Berdiri" },
              { value: "200+", label: "Anggota Aktif" },
              { value: "2x/minggu", label: "Latihan Rutin" },
            ].map((s, i) => (
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
        </div>
        <div className="relative hidden md:block">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border bg-linear-to-br from-muted/40 to-background">
            <Image
              src={heroImageUrl || "/main/about/hero.jpg"}
              alt="Kegiatan latihan GunaSmash"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
