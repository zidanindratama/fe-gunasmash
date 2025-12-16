"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, setAccessToken } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
} from "lucide-react";
import { DASHBOARD_NAV, NavItem } from "@/routes/dashboard-routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteData } from "@/hooks/use-delete-data";
import { useQueryClient } from "@tanstack/react-query";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({
  className,
  isCollapsed,
  toggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useDeleteData({
    url: "/auth/logout",
    successMessage: "You have been logged out.",
    onSuccess: async () => {
      setAccessToken(null);
      queryClient.setQueryData(["me"], null);
      await queryClient.cancelQueries({ queryKey: ["me"] });
      await queryClient.removeQueries({ queryKey: ["me"] });

      router.replace("/");
    },
  });

  return (
    <div
      className={cn(
        "relative flex flex-col h-full border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-72",
        className
      )}
    >
      <div className="flex items-center h-16 border-b px-4 overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "w-0 opacity-0 mr-0" : "w-full opacity-100 mr-2"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <span className="font-oswald text-xl font-bold tracking-tighter uppercase italic group-hover:text-primary transition-colors">
              Guna<span className="text-primary">Smash</span>
            </span>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn(
            "h-8 w-8 flex-shrink-0 transition-all duration-300",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {DASHBOARD_NAV.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="p-3 mt-auto border-t">
        <Button
          variant="ghost"
          onClick={() => logout(undefined)}
          disabled={isLoggingOut}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}

          <span
            className={cn(
              "transition-all duration-300 overflow-hidden whitespace-nowrap",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Log Out
          </span>
        </Button>
      </div>
    </div>
  );
}

function SidebarItem({
  item,
  pathname,
  isCollapsed,
}: {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasSubMenu = item.items && item.items.length > 0;

  const isActive = hasSubMenu
    ? item.items!.some((sub) => pathname === sub.href)
    : pathname === item.href;

  const isParentContextActive =
    hasSubMenu &&
    (pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)));

  React.useEffect(() => {
    if (isParentContextActive && !isCollapsed) setIsOpen(true);
  }, [isParentContextActive, isCollapsed]);

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full h-10 justify-center p-0 mb-1",
                isActive && "bg-primary/10 text-primary"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium ml-2">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hasSubMenu) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full mb-1"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-between h-10 px-3",
              isActive && !isOpen && "bg-primary/5 text-primary"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="font-medium text-sm truncate">{item.label}</span>
            </div>

            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-auto",
                isOpen && "rotate-90"
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1 py-1">
          {item.items!.map((subItem) => {
            const isSubActive = pathname === subItem.href;

            return (
              <Button
                key={subItem.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "w-full justify-start pl-10 h-9",
                  isSubActive
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link
                  href={subItem.href}
                  className="truncate block w-full text-left"
                >
                  {subItem.label}
                </Link>
              </Button>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 px-3 mb-1",
        isActive && "bg-primary/10 text-primary hover:bg-primary/15"
      )}
      asChild
    >
      <Link href={item.href} className="flex items-center w-full">
        <item.icon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        <span className="font-medium text-sm truncate flex-1 text-left">
          {item.label}
        </span>
      </Link>
    </Button>
  );
}
