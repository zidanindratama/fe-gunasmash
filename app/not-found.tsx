"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Home,
  Compass,
  Newspaper,
  Info,
  BookOpen,
  UserPlus,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-3xl border bg-linear-to-b from-muted/40 to-background p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Compass className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          Coba kembali ke beranda atau jelajahi halaman lain.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-xl px-5">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-5">
            <Link href="/about">
              <Info className="mr-2 h-4 w-4" />
              Tentang GunaSmash
            </Link>
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/announcements"
            className="group rounded-2xl border bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Newspaper className="h-4 w-4 text-primary" />
            </div>
            <div className="font-semibold">Pengumuman</div>
            <div className="text-xs text-muted-foreground">
              Info latihan, sparring, dan agenda terbaru.
            </div>
          </Link>

          <Link
            href="/blogs"
            className="group rounded-2xl border bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="font-semibold">Blog</div>
            <div className="text-xs text-muted-foreground">
              Artikel dan tips seputar bulutangkis di kampus.
            </div>
          </Link>

          <Link
            href="/auth/register"
            className="group rounded-2xl border bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div className="font-semibold">Daftar</div>
            <div className="text-xs text-muted-foreground">
              Buat akun untuk bergabung dengan GunaSmash.
            </div>
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="#" onClick={() => history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke halaman sebelumnya
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
