"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, MoveRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { signIn } from "@/lib/axios-instance";
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

const SigninSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type SigninValues = z.infer<typeof SigninSchema>;

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
        autoComplete="current-password"
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

export function Signin() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const qc = useQueryClient();

  const form = useForm<SigninValues>({
    resolver: zodResolver(SigninSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: SigninValues) {
    setSubmitting(true);
    try {
      await signIn(values.email.trim(), values.password);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Berhasil masuk. Selamat datang kembali! 👋");
      router.replace(next);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error?.message ||
        (status === 401 ? "Email atau password salah" : null) ||
        err?.message ||
        "Gagal masuk";
      if (status === 401) {
        form.setError("email", { message: " " });
        form.setError("password", { message: "Email atau password salah" });
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
              Masuk
            </CardTitle>
            <CardDescription className="text-sm">
              Akses dasbor dan fitur GunaSmash dengan akunmu.
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Lupa password?
                        </Link>
                      </div>
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

                <Button
                  type="submit"
                  className={cn("w-full")}
                  disabled={submitting || !form.formState.isValid}
                >
                  {submitting ? "Memproses..." : "Masuk"}
                  {!submitting && <MoveRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>

            <Separator className="my-6" />

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
