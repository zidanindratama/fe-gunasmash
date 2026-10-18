"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Loader2,
  Save,
  User,
  Mail,
  Camera,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useUploadData } from "@/hooks/use-upload-data";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().optional(),
});

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  avatarUrl?: string;
  createdAt?: string;
}

export function MemberProfileView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const {
    data: user,
    isLoading,
    isError,
  } = useGetData<UserProfile>({
    url: "/auth/me",
    key: ["me"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
    },
    values: user
      ? {
          name: user.name,
          avatarUrl: user.avatarUrl || "",
        }
      : undefined,
  });

  useEffect(() => {
    if (user?.avatarUrl) {
      setPreviewAvatar(user.avatarUrl);
    }
  }, [user]);

  const { mutate: updateProfile, isPending: isSaving } = usePatchData({
    url: "/auth/me",
    invalidateKeys: [["me"], ["users"]],
    successMessage: "Profile updated successfully.",
  });

  const { mutate: uploadAvatar, isPending: isUploading } = useUploadData({
    url: "/uploads/image",
    successMessage: "Avatar updated successfully.",
    onSuccess: (data: any) => {
      const newAvatarUrl = data.url;
      form.setValue("avatarUrl", newAvatarUrl);
      setPreviewAvatar(newAvatarUrl);

      if (user) {
        updateProfile({
          data: { avatarUrl: newAvatarUrl },
        });
      }
    },
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadAvatar(formData);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    updateProfile({
      data: { name: values.name },
    });
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !user) {
    return (
      <div className="max-w-4xl mx-auto pt-10">
        <Alert variant="destructive">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load profile data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto py-20 md:py-32 px-4">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2 text-primary">
          <UserCircle className="h-6 w-6" />
          <p className="font-mono text-sm uppercase tracking-widest">
            Member Profile
          </p>
        </div>
        <h1 className="break-words font-oswald text-4xl md:text-6xl font-bold uppercase tracking-tighter text-foreground leading-[1.1]">
          Manage Your <span className="text-primary">Identity</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Update your public display name and avatar. Sensitive details are
          protected.
        </p>
      </div>

      <div className="grid min-w-0 gap-8 md:grid-cols-[350px_1fr]">
        <Card className="h-fit min-w-0 shadow-xl border-2 border-border/50">
          <CardHeader className="text-center pb-2">
            <div
              className="mx-auto mb-4 relative group cursor-pointer w-28 h-28"
              role="button"
              tabIndex={0}
              aria-label="Change profile photo"
              aria-busy={isUploading}
              onClick={handleAvatarClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleAvatarClick();
                }
              }}
            >
              <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-xl transition-opacity group-hover:opacity-75">
                <AvatarImage
                  src={previewAvatar || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-oswald text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            <CardTitle className="text-xl font-oswald uppercase">
              {user.name}
            </CardTitle>
            <Badge
              variant="outline"
              className="mt-2 w-fit mx-auto border-primary/20 text-primary bg-primary/5"
            >
              {user.role}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-sm mt-4">
            {/* EMAIL INFO */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Email
                </span>
                <span className="font-medium truncate" title={user.email}>
                  {user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 shadow-xl border-2 border-border/50">
          <CardHeader>
            <CardTitle className="font-oswald uppercase">
              Update Public Info
            </CardTitle>
            <CardDescription>
              This information will be visible to other club members and
              administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                        <FormControl>
                          <Input
                            className="pl-9"
                            placeholder="Your full name"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel className="text-muted-foreground">
                    Email Address
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      className="pl-9 bg-muted/50 text-muted-foreground"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <FormDescription className="text-xs">
                    Contact admin to change your email address.
                  </FormDescription>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (user)
                        form.reset({
                          name: user.name,
                          avatarUrl: user.avatarUrl || "",
                        });
                    }}
                    disabled={isSaving || isUploading}
                  >
                    Discard
                  </Button>
                  <Button type="submit" disabled={isSaving || isUploading}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-12 md:py-20 px-4 space-y-8">
      <div className="space-y-2 text-center">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-10 w-80 mx-auto" />
      </div>
      <div className="grid gap-8 md:grid-cols-[350px_1fr]">
        <Skeleton className="h-[400px] w-full rounded-xl shadow-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl shadow-xl" />
      </div>
    </div>
  );
}
