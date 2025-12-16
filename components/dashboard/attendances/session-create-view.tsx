"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
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
import { usePostData } from "@/hooks/use-post-data";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.date({ error: "Date and time is required." }),
  isOpen: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function SessionCreateView() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      isOpen: true,
    },
  });

  const { mutate: createSession, isPending } = usePostData({
    url: "/attendances",
    invalidateKeys: [["sessions"]],
    successMessage: "Session created successfully!",
    onSuccess: () => router.push("/dashboard/attendances"),
  });

  function onSubmit(values: FormValues) {
    createSession({
      title: values.title,
      date: values.date.toISOString(),
      status: values.isOpen ? "OPEN" : "CLOSED",
    });

    console.log({
      title: values.title,
      date: values.date.toISOString(),
      status: values.isOpen ? "OPEN" : "CLOSED",
    });
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
            Create Attendance Session
          </h1>
          <p className="text-sm text-muted-foreground">
            Quickly create a session for member attendance tracking.
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
                        placeholder="Select date and time"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This date and time will be used for auto check-in
                      validation.
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
                        If enabled, members can check-in immediately.
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
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-32"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Discard
                </Button>
                <Button type="submit" className="w-40" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Create Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
