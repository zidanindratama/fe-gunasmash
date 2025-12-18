// components/member/member-check-in-view.tsx

"use client";

import { useState } from "react";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ListTodo,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ATTENDANCE_WINDOW_HOURS = 3;

interface MemberSessionItem {
  id: string;
  title: string;
  date: string;
  location: string;
  isUserAttended: boolean;
}

function SessionCard({
  session,
  onCheckIn,
  isCheckingIn,
}: {
  session: MemberSessionItem;
  onCheckIn: (announcementId: string) => void;
  isCheckingIn: boolean;
}) {
  const dateTime = new Date(session.date);
  const dateStr = format(dateTime, "EEEE, d MMM yyyy", { locale: idLocale });
  const timeStr = format(dateTime, "HH:mm 'WIB'");

  const expiryTime =
    dateTime.getTime() + ATTENDANCE_WINDOW_HOURS * 60 * 60 * 1000;
  const isExpired = Date.now() > expiryTime;

  if (session.isUserAttended) {
    return (
      <Card className="border-green-500 bg-green-50/50 dark:bg-green-900/10 shadow-lg transition-all duration-300">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl text-green-600 flex items-center gap-3 font-oswald uppercase tracking-wider">
            <CheckCircle className="h-6 w-6 fill-green-500 text-white" />
            ATTENDANCE RECORDED
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-3">
          <p className="font-semibold text-foreground text-lg">
            {session.title}
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" /> {dateStr}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" /> {timeStr}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isExpired) {
    return (
      <Card className="border-destructive bg-red-50/50 dark:bg-red-900/10 shadow-lg opacity-70">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl text-destructive flex items-center gap-3 font-oswald uppercase tracking-wider">
            <AlertTriangle className="h-6 w-6 fill-destructive text-white" />
            SESSION CLOSED
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-3">
          <p className="font-semibold text-foreground text-lg">
            {session.title}
          </p>
          <p className="text-sm text-destructive/80 italic">
            Attendance window has ended (Closed {ATTENDANCE_WINDOW_HOURS}h after
            start time).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-2 border-border/50 shadow-xl transition-shadow duration-300 hover:border-primary/80 hover:shadow-primary/30">
      <CardHeader className="p-4 md:p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-oswald uppercase tracking-wide">
          {session.title}
        </CardTitle>
        <Badge
          variant="default"
          className="bg-primary hover:bg-primary/90 text-white shadow-md animate-pulse"
        >
          Open Now
        </Badge>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 space-y-4">
        <div className="text-sm text-muted-foreground space-y-2 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> {dateStr}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> {timeStr}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {session.location}
          </div>
        </div>
        <Button
          className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-md transition-transform hover:scale-[1.01]"
          onClick={() => onCheckIn(session.id)}
          disabled={isCheckingIn}
        >
          {isCheckingIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Check In Now"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function MemberCheckInView() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const {
    data: sessionList,
    isLoading,
    refetch,
  } = useGetData<{ items: MemberSessionItem[] }>({
    url: "/attendances/member/sessions",
    key: ["member-sessions"],
  });

  const { mutate: checkInMutate } = usePostData({
    url: "/attendances/check-in",
    invalidateKeys: [["member-sessions"]],
    successMessage: "Check-in successful! Welcome to the session.",
    onSuccess: () => {
      setIsCheckingIn(false);
      refetch();
    },
    onError: (e) => {
      setIsCheckingIn(false);
      const msg =
        (e as any)?.response?.data?.error?.message ||
        "Check-in failed due to server error.";
      toast.error(msg);
    },
  });

  const handleCheckIn = (announcementId: string) => {
    setIsCheckingIn(true);
    checkInMutate({ announcementId });
  };

  const availableSessions = sessionList?.items || [];

  const sortedSessions = availableSessions.sort((a, b) => {
    if (a.isUserAttended !== b.isUserAttended) {
      return a.isUserAttended ? 1 : -1;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const totalAttended = sortedSessions.filter((s) => s.isUserAttended).length;
  const totalActive = sortedSessions.length;

  return (
    <section className="min-h-screen py-20 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <p className="font-mono text-sm uppercase tracking-widest">
              Member Portal
            </p>
          </div>
          <h1 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-tighter text-foreground leading-[1.1]">
            Record Your <span className="text-primary">Attendance</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Quickly check in for active sessions. Your attendance status is
            updated instantly below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">
                Total Active Sessions
              </CardTitle>
              <ListTodo className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-oswald text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : totalActive}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">
                Your Status
              </CardTitle>
              <Users className="h-5 w-5 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-oswald text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : totalActive === 0 ? (
                  "N/A"
                ) : totalAttended === totalActive ? (
                  <span className="text-green-600">COMPLETE</span>
                ) : (
                  <span className="text-destructive">PENDING</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-green-500/50 bg-green-50/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-green-600">
                Sessions Checked In
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="font-oswald text-3xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-10" /> : totalAttended}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        ) : sortedSessions.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground bg-muted/20">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-semibold text-lg">No Active Sessions Found</p>
            <p className="text-sm mt-1">
              Please check back closer to your schedule or contact the Admin.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onCheckIn={handleCheckIn}
                isCheckingIn={isCheckingIn}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
