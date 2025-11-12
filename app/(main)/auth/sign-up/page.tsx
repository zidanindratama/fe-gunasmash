import { Signup } from "@/components/main/auth/sign-up";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense>
      <Signup />
    </Suspense>
  );
}
