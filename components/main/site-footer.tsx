"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/announcements", label: "Pengumuman" },
  { href: "/blogs", label: "Blog" },
];

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative border-t border-border/60 bg-linear-to-b from-muted/40 to-background",
        className
      )}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h3 className="text-lg font-bold">GunaSmash</h3>
                <p className="text-sm text-muted-foreground">
                  Badminton Club Gunadarma
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              UKM Bulutangkis Universitas Gunadarma. Latihan terstruktur,
              sparring rutin, dan komunitas yang aktif untuk semua tingkat
              kemampuan.
            </p>
            <div className="flex gap-3 pt-2">
              {" "}
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 transition-colors hover:bg-accent/50"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 transition-colors hover:bg-accent/50"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 transition-colors hover:bg-accent/50"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                Navigasi
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                Informasi
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>Kampus H Universitas Gunadarma, Depok</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:gunasmash@gunadarma.ac.id"
                    className="transition-colors hover:text-primary"
                  >
                    gunasmash@gunadarma.ac.id
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">GunaSmash</span>.
            Semua hak cipta dilindungi.
          </p>
          <p>
            Dibangun oleh{" "}
            <Link
              href="https://zidanindratama.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Muhamad Zidan Indratama
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
