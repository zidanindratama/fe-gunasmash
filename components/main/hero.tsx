"use client";

import * as React from "react";
import Image from "next/image";
import { Youtube, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

type HeroProps = {
  backgroundUrl?: string;
  className?: string;
};

export function Hero({ backgroundUrl, className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-28",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {backgroundUrl ? (
          <>
            <Image
              src={backgroundUrl}
              alt="Latar belakang GunaSmash"
              fill
              priority
              className="object-cover brightness-[0.85] contrast-[1.05] saturate-[1.05]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background/60 via-background/25 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
        )}
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-extrabold leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              GunaSmash
              <br />
              <span className="text-primary">Badminton</span> Club
              <br />
              Universitas Gunadarma
            </h1>

            <p className="mt-6 text-base text-black md:text-lg max-w-[620px]">
              Wadah bagi mahasiswa yang ingin berlatih, bertanding, dan
              mengembangkan kemampuan bulutangkis bersama. Bergabunglah dan
              jadilah bagian dari komunitas kami.
            </p>

            <div className="mt-8 flex items-center gap-5">
              <div className="flex -space-x-3">
                <Avatar className="ring-2 ring-background">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@member"
                  />
                  <AvatarFallback className="bg-indigo-500 text-white">
                    GM
                  </AvatarFallback>
                </Avatar>
                <Avatar className="ring-2 ring-background">
                  <AvatarFallback className="bg-green-600 text-white">
                    IM
                  </AvatarFallback>
                </Avatar>
                <Avatar className="ring-2 ring-background">
                  <AvatarFallback className="bg-red-500 text-white">
                    AZ
                  </AvatarFallback>
                </Avatar>
                <Avatar className="ring-2 ring-background">
                  <AvatarFallback className="bg-orange-500 text-white">
                    WK
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <div className="text-sm font-semibold">200+ Anggota</div>
                <div className="text-xs text-black">
                  ★ Aktif berlatih setiap minggu
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-xl px-7">
                Daftar Anggota
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-7 bg-background/70 backdrop-blur"
              >
                Lihat Jadwal
              </Button>
            </div>
          </div>
        </div>

        <div className="relative hidden md:block aspect-5/6 w-full" />
      </div>

      <div className="pointer-events-auto absolute right-4 top-28 hidden flex-col items-center md:flex">
        <span className="-rotate-90 text-xs tracking-wide text-white">
          Media Sosial
        </span>
        <div className="my-9 h-28 w-px bg-white" />
        <div className="flex flex-col gap-4">
          <Link
            href="https://twitter.com"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border p-2 hover:bg-accent/50 transition-colors"
          >
            <Instagram className="h-5 w-5 text-white" />
          </Link>

          <Link
            href="https://twitter.com"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border p-2 hover:bg-accent/50 transition-colors"
          >
            <Twitter className="h-5 w-5 text-white" />
          </Link>

          <Link
            href="https://facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border p-2 hover:bg-accent/50 transition-colors"
          >
            <Facebook className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
