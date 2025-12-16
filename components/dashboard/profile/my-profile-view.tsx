"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Save,
  User,
  Mail,
  Calendar,
  Camera,
  ShieldCheck,
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
import { Separator } from "@/components/ui/separator";
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

export function MyProfileView() {
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
    url: "/users",
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
          slug: user.id,
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
      slug: user.id,
      data: { name: values.name },
    });
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !user) {
    return (
      <Alert variant="destructive">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load profile data.</AlertDescription>
      </Alert>
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader className="text-center pb-2">
            <div
              className="mx-auto mb-4 relative group cursor-pointer w-28 h-28"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl transition-opacity group-hover:opacity-75">
                <AvatarImage
                  src={previewAvatar || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
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
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <Badge
              variant="outline"
              className="mt-2 w-fit mx-auto border-primary/20 text-primary bg-primary/5"
            >
              {user.role}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-sm mt-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="font-medium truncate" title={user.email}>
                  {user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your display name. Email and Role are managed by
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
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder="Your name"
                            {...field}
                          />
                        </div>
                      </FormControl>
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    </div>
  );
}
