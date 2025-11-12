"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Trophy,
  LogOut,
  LayoutDashboard,
  Users,
  Bell,
  Newspaper,
  CalendarCheck,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { logout, User } from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/announcements", label: "Pengumuman" },
  { href: "/blogs", label: "Blog" },
];

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type MePayload = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  avatarUrl?: string | null;
};

function useMe() {
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<MePayload>>("/api/auth/me");
        if (!("success" in res.data) || !res.data.success) return null;
        return res.data.data as User;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401) return null;
        throw e;
      }
    },
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function SiteNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { data: me } = useMe();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      qc.setQueryData(["me"], null);
      router.replace("/");
    }
  }

  const initials = React.useMemo(() => {
    if (!me?.name) return "GU";
    const parts = me.name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [me?.name]);

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
          {!me ? (
            <Button
              size="lg"
              className="rounded-xl px-6 cursor-pointer transition-transform hover:scale-[1.02]"
              asChild
            >
              <Link href="/auth/sign-up">Bergabung Sekarang</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 hover:bg-accent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={me?.avatarUrl ?? undefined}
                      alt={me.name}
                    />
                    <AvatarFallback className="font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="line-clamp-2">
                  {me.name}
                  <div className="text-xs font-normal text-muted-foreground">
                    {me.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/attendance"
                    className="flex w-full items-center gap-2"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>Absen</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/announcements"
                    className="flex w-full items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Pengumuman</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/users"
                    className="flex w-full items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Pengguna</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/blogs"
                    className="flex w-full items-center gap-2"
                  >
                    <Newspaper className="h-4 w-4" />
                    <span>Blog</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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

              <div className="flex flex-col">
                {me ? (
                  <div className="flex items-center gap-3 border-b px-4 py-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={me?.avatarUrl ?? undefined}
                        alt={me.name}
                      />
                      <AvatarFallback className="font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {me.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {me.email}
                      </div>
                    </div>
                  </div>
                ) : null}

                <nav
                  className="flex flex-col gap-1 px-2 py-2"
                  role="navigation"
                >
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

                  {me ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base hover:bg-accent/60"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/attendance"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base hover:bg-accent/60"
                      >
                        Absen
                      </Link>
                      <Link
                        href="/announcements"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base hover:bg-accent/60"
                      >
                        Pengumuman
                      </Link>
                      <Link
                        href="/users"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base hover:bg-accent/60"
                      >
                        Pengguna
                      </Link>
                      <Link
                        href="/dashboard/blogs"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base hover:bg-accent/60"
                      >
                        Blog
                      </Link>
                    </>
                  ) : null}
                </nav>
              </div>

              <div className="sticky inset-x-0 bottom-0 border-t bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/80">
                {!me ? (
                  <Button
                    className="w-full rounded-xl py-6 text-base cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => setOpen(false)}
                    asChild
                  >
                    <Link href="/auth/sign-up">Bergabung Sekarang</Link>
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl py-6 text-base cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={async () => {
                      await handleLogout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
