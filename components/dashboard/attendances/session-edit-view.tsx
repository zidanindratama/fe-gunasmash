"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatchData } from "@/hooks/use-patch-data";
import { useGetData } from "@/hooks/use-get-data";
import React from "react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  date: z.date().optional(),
  isOpen: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SessionDetail {
  id: string;
  announcementId: string;
  title: string;
  date: string;
  state: "OPEN" | "CLOSED";
  openedAt: string | null;
  closedAt: string | null;
}

interface SessionEditViewProps {
  id: string;
}

export function SessionEditView({ id }: SessionEditViewProps) {
  const router = useRouter();

  const {
    data: sessionDetail,
    isLoading: isSessionLoading,
    isError: isSessionError,
  } = useGetData<SessionDetail>({
    url: `/attendances/${id}`,
    key: ["session-detail", id],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: undefined,
      date: undefined,
      isOpen: undefined,
    },
  });

  React.useEffect(() => {
    if (sessionDetail) {
      form.reset({
        title: sessionDetail.title,
        date: new Date(sessionDetail.date),
        isOpen: sessionDetail.state === "OPEN",
      });
    }
  }, [sessionDetail, form]);

  const { mutate: updateSession, isPending: isUpdating } = usePatchData({
    url: `/attendances`,
    invalidateKeys: [
      ["sessions"],
      ["session-detail", id],
      ["session-summary", id],
    ],
    successMessage: "Session details updated successfully!",
    onSuccess: () => router.push(`/dashboard/attendances/${id}`),
  });

  function onSubmit(values: FormValues) {
    if (!sessionDetail) {
      toast.error("Session data is not loaded.");
      return;
    }

    const payload: any = {};

    if (values.title && values.title !== sessionDetail.title) {
      payload.title = values.title;
    }

    if (values.date) {
      const currentDatetime = new Date(sessionDetail.date).getTime();
      const newDatetime = values.date.getTime();

      if (newDatetime !== currentDatetime) {
        payload.date = values.date.toISOString();
      }
    }

    const newStatus = values.isOpen ? "OPEN" : "CLOSED";
    if (newStatus !== sessionDetail.state) {
      payload.status = newStatus;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save.");
      router.push(`/dashboard/attendances/${id}`);
      return;
    }

    updateSession({
      slug: id,
      data: payload,
    });
  }

  if (isSessionLoading) {
    return <SessionEditSkeleton />;
  }

  if (isSessionError || !sessionDetail) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch session details. The session might not exist.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 border-destructive/50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide">
            Edit Session: {sessionDetail.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the title, schedule, or status of this attendance session.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Regular Friday Practice"
                        className="text-lg font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Start Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hourCycle={24}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Changing the date or time will update the related
                      Announcement.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Separator className="mt-8 mb-4" />

              <FormField
                control={form.control}
                name="isOpen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Open for Check-in</FormLabel>
                      <FormDescription className="text-xs">
                        Status: {field.value ? "OPEN" : "CLOSED"}. Toggle to
                        open or close the attendance window.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => router.back()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-40" disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SessionEditSkeleton() {
  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
