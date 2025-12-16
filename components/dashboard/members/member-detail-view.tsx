"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  Shield,
  ShieldAlert,
  User,
  Mail,
  Calendar,
  Camera,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  role: z.enum(["ADMIN", "MEMBER"]),
  avatarUrl: z.string().optional(),
});

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  avatarUrl?: string;
  createdAt?: string;
}

interface MemberDetailViewProps {
  id: string;
}

export function MemberDetailView({ id }: MemberDetailViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const {
    data: user,
    isLoading,
    isError,
  } = useGetData<UserDetail>({
    url: `/users/${id}`,
    key: ["user-detail", id],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "MEMBER",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl || "",
      });
      setPreviewAvatar(user.avatarUrl || null);
    }
  }, [user, form]);

  const { mutate: updateUser, isPending: isSaving } = usePatchData({
    url: `/users`,
    invalidateKeys: [["users"], ["user-detail", id]],
    successMessage: "Member profile updated successfully.",
  });

  const { mutate: uploadAvatar, isPending: isUploading } = useUploadData({
    url: "/uploads/image",
    successMessage: "Avatar updated successfully.",
    onSuccess: (data: any) => {
      const newAvatarUrl = data.url;
      form.setValue("avatarUrl", newAvatarUrl);
      setPreviewAvatar(newAvatarUrl);
      updateUser({
        slug: id,
        data: { avatarUrl: newAvatarUrl },
      });
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadAvatar(formData);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser({
      slug: id,
      data: {
        name: values.name,
        role: values.role,
      },
    });
  }

  if (isLoading) {
    return <MemberDetailSkeleton />;
  }

  if (isError || !user) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load member details. The user might not exist.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
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
    <div className="max-w-5xl mx-auto">
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
            Member Details
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage profile information for {user.name}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <Card>
          <CardHeader className="text-center">
            <div
              className="mx-auto mb-4 relative group cursor-pointer w-24 h-24"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl transition-opacity group-hover:opacity-75">
                <AvatarImage
                  src={previewAvatar || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
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

              <Badge
                className={`absolute bottom-0 right-0 px-3 py-1 text-xs border-2 border-background pointer-events-none ${
                  user.role === "ADMIN"
                    ? "bg-primary"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {user.role}
              </Badge>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Email Address
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Role Access
                </span>
                <span className="font-medium">{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update the member's personal information and role permissions.
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
                            placeholder="John Doe"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Display name for the member.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Role</FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MEMBER">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Member</span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px]"
                              >
                                READ-ONLY
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <span>Administrator</span>
                              <Badge className="ml-auto text-[10px]">
                                FULL-ACCESS
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Admins have full access to manage members and content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (user) {
                        form.reset({
                          name: user.name,
                          role: user.role,
                          avatarUrl: user.avatarUrl,
                        });
                      }
                    }}
                    disabled={isSaving || isUploading}
                  >
                    Reset Changes
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

function MemberDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  );
}
