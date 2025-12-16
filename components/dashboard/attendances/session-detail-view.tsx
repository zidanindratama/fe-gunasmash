"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { usePostData } from "@/hooks/use-post-data";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  Download,
  Users,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Loader2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserSearchCombobox } from "./user-search-combobox";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface SessionDetail {
  id: string;
  announcementId: string;
  title: string;
  date: string;
  state: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
}

interface SessionSummary {
  session: {
    id: string;
    date: string;
    state: "OPEN" | "CLOSED";
    openedAt: string;
    closedAt?: string;
  } | null;
  counts: {
    totalMembers: number;
    present: number;
    absent: number;
  };
  presentUsers: { id: string; name: string; email: string }[];
  absentUsers: { id: string; name: string; email: string }[];
}

export function SessionDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [manualUserId, setManualUserId] = useState("");
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"present" | "absent">("present");

  const [presentPage, setPresentPage] = useState(1);
  const [absentPage, setAbsentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pageSize = 10;

  const [cancelConfirmation, setCancelConfirmation] = useState<{
    userId: string;
    userName: string;
    open: boolean;
  } | null>(null);

  const { data: sessionData, isLoading: isDetailLoading } =
    useGetData<SessionDetail>({
      url: `/attendances/${id}`,
      key: ["session-detail-view", id],
    });

  const announcementId = sessionData?.announcementId;
  const dateStr = sessionData?.date
    ? format(new Date(sessionData.date), "yyyy-MM-dd")
    : "";

  const summaryParams = useMemo(
    () => ({
      announcementId,
      date: dateStr,
      page: activeTab === "present" ? presentPage : absentPage,
      limit: pageSize,
      search: debouncedSearchTerm,
    }),
    [
      announcementId,
      dateStr,
      activeTab,
      presentPage,
      absentPage,
      debouncedSearchTerm,
    ]
  );

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetData<SessionSummary>({
    url: "/attendances/session/summary",
    key: [
      "session-summary",
      id,
      String(summaryParams.page),
      activeTab,
      debouncedSearchTerm,
    ],
    params: summaryParams,
    options: {
      enabled: !!announcementId && !!dateStr,
    },
  });

  const { mutate: updateStatus, isPending: isUpdating } = usePatchData({
    url: `/attendances/${id}`,
    invalidateKeys: [
      ["sessions"],
      ["session-summary", id],
      ["session-detail-view", id],
    ],
    successMessage: "Session status updated successfully",
  });

  const { mutate: manualCheckIn, isPending: isCheckingIn } = usePostData({
    url: "/attendances/admin/check-in",
    invalidateKeys: [["session-summary", id]],
    successMessage: "Attendance status updated successfully",
    onSuccess: () => {
      setManualDialogOpen(false);
      setManualUserId("");
      refetchSummary();
    },
  });

  const handleExport = async () => {
    try {
      if (!announcementId || !dateStr) return;

      const response = await axiosInstance.get("/attendances/session/export", {
        params: { announcementId, date: dateStr },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance-${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast.error("Failed to export CSV");
    }
  };

  const handleUpdateStatus = (status: "OPEN" | "CLOSED") => {
    updateStatus({ data: { status } });
  };

  const handleManualSubmit = () => {
    if (!manualUserId) {
      toast.error("Please select a member first.");
      return;
    }

    manualCheckIn({
      announcementId,
      userId: manualUserId,
      status: "PRESENT",
    });
  };

  const handleUserStatusChange = (
    userId: string,
    userName: string,
    status: "PRESENT" | "ABSENT"
  ) => {
    if (!announcementId) return;

    if (status === "ABSENT") {
      setCancelConfirmation({ userId, userName, open: true });
      return;
    }

    manualCheckIn({
      announcementId: announcementId,
      userId: userId,
      status: status,
    });
  };

  const handleConfirmCancel = () => {
    if (!cancelConfirmation || !announcementId) return;

    manualCheckIn({
      announcementId: announcementId,
      userId: cancelConfirmation.userId,
      status: "ABSENT",
    });
  };

  if (isDetailLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-bold">Session Not Found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide">
              {sessionData.title}
            </h1>
            <div className="text-muted-foreground flex items-center gap-3 text-sm mt-1">
              <span>
                {format(new Date(sessionData.date), "EEEE, d MMMM yyyy", {
                  locale: idLocale,
                })}
              </span>
              <Badge
                variant={sessionData.state === "OPEN" ? "default" : "secondary"}
                className={
                  sessionData.state === "OPEN"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                {sessionData.state}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>

          {sessionData.state === "OPEN" ? (
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus("CLOSED")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Close Session
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleUpdateStatus("OPEN")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="mr-2 h-4 w-4" />
              )}
              Re-Open Session
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSummaryLoading ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                summary?.counts.totalMembers || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isSummaryLoading ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                summary?.counts.present || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {isSummaryLoading ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                summary?.counts.absent || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Log</CardTitle>

          <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Manual Check-In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manual Member Check-In</DialogTitle>
                <DialogDescription>
                  Select a member and mark them as present for this session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">Select Member</Label>
                  <UserSearchCombobox
                    onSelectUser={setManualUserId}
                    selectedUserId={manualUserId}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleManualSubmit}
                  disabled={isCheckingIn || !manualUserId}
                >
                  {isCheckingIn && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Check In
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (value === "present") setAbsentPage(1);
              if (value === "absent") setPresentPage(1);
              setSearchTerm("");
              setActiveTab(value as "present" | "absent");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="present">
                Present ({summary?.counts.present || 0})
              </TabsTrigger>
              <TabsTrigger value="absent">
                Absent ({summary?.counts.absent || 0})
              </TabsTrigger>
            </TabsList>

            <Input
              placeholder={`Search ${activeTab} members...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeTab === "present") setPresentPage(1);
                if (activeTab === "absent") setAbsentPage(1);
              }}
              className="w-full max-w-[400px] my-4"
            />

            <div className="mt-4">
              <TabsContent value="present" className="space-y-4">
                <AttendanceUserList
                  users={summary?.presentUsers || []}
                  isLoading={isSummaryLoading}
                  count={summary?.counts.present || 0}
                  page={presentPage}
                  pageSize={pageSize}
                  onPageChange={setPresentPage}
                  status="Present"
                  onUserStatusChange={handleUserStatusChange}
                />
              </TabsContent>

              <TabsContent value="absent" className="space-y-4">
                <AttendanceUserList
                  users={summary?.absentUsers || []}
                  isLoading={isSummaryLoading}
                  count={summary?.counts.absent || 0}
                  page={absentPage}
                  pageSize={pageSize}
                  onPageChange={setAbsentPage}
                  status="Absent"
                  onUserStatusChange={handleUserStatusChange}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={cancelConfirmation?.open || false}
        onOpenChange={(open) => !open && setCancelConfirmation(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Confirm Cancellation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the attendance record for
              <span className="font-semibold text-foreground">
                {" "}
                {cancelConfirmation?.userName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelConfirmation(null)}
              disabled={isCheckingIn}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCheckingIn}
            >
              {isCheckingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Confirm & Cancel Attendance"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AttendanceUserListProps {
  users: { id: string; name: string; email: string }[];
  isLoading: boolean;
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  status: "Present" | "Absent";
  onUserStatusChange: (
    userId: string,
    userName: string,
    status: "PRESENT" | "ABSENT"
  ) => void;
}

function AttendanceUserList({
  users,
  isLoading,
  count,
  page,
  pageSize,
  onPageChange,
  status,
  onUserStatusChange,
}: AttendanceUserListProps) {
  const totalPages = Math.ceil(count / pageSize);
  const maxPagesToShow = 5;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
        No {status.toLowerCase()} members found.
      </div>
    );
  }

  let startPage: number;
  let endPage: number;

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

    if (page <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (page + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = page - maxPagesBeforeCurrentPage;
      endPage = page + maxPagesAfterCurrentPage;
    }
  }

  const pageItems: (number | "ellipsis")[] = [];

  if (startPage > 1) {
    pageItems.push(1);
    if (startPage > 2) {
      pageItems.push("ellipsis");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageItems.push("ellipsis");
    }
    if (pageItems[pageItems.length - 1] !== totalPages && totalPages > 1) {
      pageItems.push(totalPages);
    }
  }

  const finalPageItems = pageItems.filter(
    (item, index) => pageItems.indexOf(item) === index
  );

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={cn(
            "flex items-center justify-between p-3 border rounded-lg transition-colors",
            status === "Present"
              ? "bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50"
              : "opacity-70 hover:opacity-100"
          )}
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              variant={status === "Present" ? "default" : "outline"}
              className={
                status === "Present"
                  ? "bg-green-600 hover:bg-green-700"
                  : "text-muted-foreground border-muted-foreground/30"
              }
            >
              {status}
            </Badge>

            {status === "Present" && (
              <Button
                variant="destructive"
                size="icon"
                className="h-7 w-7 transition-transform hover:scale-105"
                onClick={() => onUserStatusChange(user.id, user.name, "ABSENT")}
                title="Cancel Attendance"
              >
                <UserX className="h-4 w-4" />
              </Button>
            )}

            {status === "Absent" && (
              <Button
                variant="default"
                size="icon"
                className="h-7 w-7 bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                onClick={() =>
                  onUserStatusChange(user.id, user.name, "PRESENT")
                }
                title="Mark as Present"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  href="#"
                  className={cn(page === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>

              {finalPageItems.map((item, index) => (
                <PaginationItem key={index}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={item === page}
                      onClick={() => onPageChange(item as number)}
                      href="#"
                      className={cn(
                        item === page && "cursor-default pointer-events-none"
                      )}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(page + 1)}
                  href="#"
                  className={cn(
                    page === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
