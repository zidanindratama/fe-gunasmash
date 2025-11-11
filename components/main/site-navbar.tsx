"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/announcements", label: "Pengumuman" },
  { href: "/blogs", label: "Blog" },
];

export function SiteNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/50",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            GunaSmash
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" role="navigation">
          {NAV.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "cursor-pointer text-sm font-medium transition-colors",
                isActive(i.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            size="lg"
            className="rounded-xl px-6 cursor-pointer transition-transform hover:scale-[1.02]"
            asChild
          >
            <Link href="/auth/sign-up">Bergabung Sekarang</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </span>
                  GunaSmash
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigasi utama
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-2 py-2" role="navigation">
                {NAV.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base cursor-pointer transition-colors select-none",
                      isActive(i.href)
                        ? "bg-accent text-foreground"
                        : "text-foreground hover:bg-accent/60"
                    )}
                  >
                    {i.label}
                  </Link>
                ))}
              </nav>

              <div className="sticky inset-x-0 bottom-0 border-t bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/80">
                <Button
                  className="w-full rounded-xl py-6 text-base cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/auth/sign-up">Bergabung Sekarang</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
