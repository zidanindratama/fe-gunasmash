"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, User, Lock, Eye, EyeOff, MoveRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { signUp } from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const SignupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(60, "Nama terlalu panjang"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });

type SignupValues = z.infer<typeof SignupSchema>;

function PasswordField({
  value,
  onChange,
  id,
  placeholder,
  disabled,
}: {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Signup() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const qc = useQueryClient();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: SignupValues) {
    setSubmitting(true);
    try {
      await signUp({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Registrasi berhasil. Selamat datang! 🎉");
      router.replace(next);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Gagal melakukan sign up";
      if (err?.response?.status === 409) {
        form.setError("email", { message: "Email sudah digunakan" });
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl border bg-linear-to-b from-muted/40 to-background shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Buat akun
            </CardTitle>
            <CardDescription className="text-sm">
              Gabung komunitas GunaSmash dan dapatkan akses penuh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Nama lengkap"
                            {...field}
                            disabled={submitting}
                            autoComplete="name"
                          />
                          <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="nama@kampus.ac.id"
                            {...field}
                            disabled={submitting}
                            autoComplete="email"
                          />
                          <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PasswordField
                              id="password"
                              placeholder="••••••••"
                              value={field.value}
                              onChange={field.onChange}
                              disabled={submitting}
                            />
                            <Lock className="pointer-events-none absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            id="confirmPassword"
                            placeholder="••••••••"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className={cn("w-full")}
                  disabled={submitting || !form.formState.isValid}
                >
                  {submitting ? "Membuat akun..." : "Buat akun"}
                  {!submitting && <MoveRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>

            <Separator className="my-6" />

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
