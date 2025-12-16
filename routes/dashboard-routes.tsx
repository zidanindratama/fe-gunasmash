import {
  LayoutDashboard,
  Megaphone,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  PlusCircle,
  List,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  items?: NavItem[];
}

export const DASHBOARD_NAV: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Announcements",
    href: "/dashboard/announcements",
    icon: Megaphone,
    items: [
      {
        label: "All Announcements",
        href: "/dashboard/announcements",
        icon: List,
      },
      {
        label: "Create New",
        href: "/dashboard/announcements/create",
        icon: PlusCircle,
      },
    ],
  },
  {
    label: "Attendances",
    href: "/dashboard/attendances",
    icon: CalendarCheck,
    items: [
      {
        label: "Sessions",
        href: "/dashboard/attendances",
        icon: List,
      },
      {
        label: "Create Session",
        href: "/dashboard/attendances/create",
        icon: PlusCircle,
      },
    ],
  },
  {
    label: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    label: "Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
    items: [
      {
        label: "All Posts",
        href: "/dashboard/blogs",
        icon: List,
      },
      {
        label: "New Post",
        href: "/dashboard/blogs/create",
        icon: PlusCircle,
      },
    ],
  },
];
