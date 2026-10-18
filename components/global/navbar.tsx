"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/routes/main-routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  LogOut,
  User,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetData } from "@/hooks/use-get-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { getAccessToken, setAccessToken } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthPage = pathname.startsWith("/auth");

  const { data: user, isLoading: isLoadingUser } = useGetData<UserProfile>({
    url: "/auth/me",
    key: ["me"],
    options: {
      enabled: isMounted && Boolean(getAccessToken()),
      retry: false,
    },
  });

  const isLoadingUserState =
    !isMounted || (Boolean(getAccessToken()) && isLoadingUser);

  const userRole = user?.role;

  const memberPortalRoute = "/member/check-in";
  const mainDashboardRoute = "/dashboard";
  const primaryRoute =
    userRole === "ADMIN" ? mainDashboardRoute : memberPortalRoute;
  const primaryIcon = userRole === "ADMIN" ? LayoutDashboard : CalendarCheck;
  const primaryLabel =
    userRole === "ADMIN" ? "Dashboard Admin" : "Check-In Portal";

  const adminProfileRoute = "/dashboard/profile";
  const memberProfileRoute = "/member/profile";
  const profileRoute =
    userRole === "ADMIN" ? adminProfileRoute : memberProfileRoute;

  const { mutate: logout, isPending: isLoggingOut } = useDeleteData({
    url: "/auth/logout",
    successMessage: "You have been logged out.",
    onSuccess: async () => {
      setAccessToken(null);

      queryClient.setQueryData(["me"], null);

      await queryClient.cancelQueries({ queryKey: ["me"] });

      await queryClient.removeQueries({ queryKey: ["me"] });

      setIsOpen(false);
      router.replace("/");
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVars: Variants = {
    initial: { y: "-100%" },
    animate: {
      y: 0,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      y: "-100%",
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  const linkVars: Variants = {
    initial: {
      y: "30vh",
      transition: { duration: 0.7, ease: [0.37, 0, 0.63, 1] },
    },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } },
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const PrimaryIconComponent = primaryIcon;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
            : "py-6 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 z-50">
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-oswald text-2xl font-bold tracking-tighter uppercase italic text-foreground group-hover:text-primary transition-colors">
              Guna<span className="text-primary">Smash</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wide transition-colors relative group ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 z-50">
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {!isAuthPage && (
            <div className="hidden md:block">
              {isLoadingUserState ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-primary uppercase font-bold mt-1">
                          {userRole}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href={primaryRoute}
                        className="cursor-pointer flex items-center"
                      >
                        <PrimaryIconComponent className="mr-2 h-4 w-4 text-primary" />
                        {primaryLabel}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href={profileRoute}
                        className="cursor-pointer flex items-center"
                      >
                        <User className="mr-2 h-4 w-4 text-primary" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => logout(undefined)}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  variant="default"
                  className="rounded-full px-6 font-semibold"
                >
                  <Link href={"/auth/sign-up"}>Join the Club</Link>
                </Button>
              )}
            </div>
          )}

          <button
            className={`flex md:hidden flex-col gap-1.5 items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 group ${
              scrolled
                ? "border-border bg-background/80 backdrop-blur-sm"
                : "border-transparent bg-transparent"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
              className={`w-5 h-[2px] origin-center transition-colors ${
                isOpen
                  ? "bg-foreground"
                  : "bg-foreground group-hover:bg-primary"
              }`}
            />
            <motion.div
              animate={{ opacity: isOpen ? 0 : 1 }}
              className={`w-5 h-[2px] transition-colors ${
                isOpen
                  ? "bg-foreground"
                  : "bg-foreground group-hover:bg-primary"
              }`}
            />
            <motion.div
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
              className={`w-5 h-[2px] origin-center transition-colors ${
                isOpen
                  ? "bg-foreground"
                  : "bg-foreground group-hover:bg-primary"
              }`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center px-6 md:hidden origin-top"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col items-center gap-6 z-10 w-full max-w-sm"
            >
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <div key={link.href} className="overflow-hidden">
                    <motion.div variants={linkVars}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`font-oswald text-5xl font-bold uppercase tracking-tight transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}

              <div className="overflow-hidden mt-8 w-full">
                <motion.div
                  variants={linkVars}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-full h-[1px] bg-border" />

                  <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                      Switch Theme
                    </span>
                  </div>

                  {!isAuthPage && (
                    <div className="w-full">
                      {isLoadingUserState ? (
                        <div className="flex flex-col items-center gap-4">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                      ) : user ? (
                        <div className="flex flex-col gap-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Avatar className="h-16 w-16 border-2 border-primary">
                              <AvatarImage
                                src={user.avatarUrl}
                                alt={user.name}
                              />
                              <AvatarFallback className="text-lg">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-oswald text-xl uppercase font-bold">
                                {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                              <p className="text-xs text-primary uppercase font-bold mt-1">
                                {userRole}
                              </p>
                            </div>
                          </div>

                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link
                              href={primaryRoute}
                              className="flex items-center gap-2"
                            >
                              <PrimaryIconComponent className="w-5 h-5" />
                              {primaryLabel}
                            </Link>
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full h-12 border-2 border-border text-foreground hover:bg-muted/50 hover:border-primary/50"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link
                              href={profileRoute}
                              className="flex items-center gap-2"
                            >
                              <User className="w-5 h-5 text-primary" />
                              My Profile
                            </Link>
                          </Button>

                          <Button
                            variant="destructive"
                            size="lg"
                            className="w-full rounded-full h-12"
                            onClick={() => logout(undefined)}
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Log Out
                          </Button>
                        </div>
                      ) : (
                        <Button
                          asChild
                          size="lg"
                          className="w-full rounded-full text-lg h-14"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href={"/auth/sign-up"}>Join Member Area</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className="absolute bottom-10 text-xs text-muted-foreground uppercase tracking-widest"
            >
              Gunadarma Smash Club © 2025
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
