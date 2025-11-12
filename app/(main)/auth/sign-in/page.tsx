import { Signin } from "@/components/main/auth/sign-in";
import { Suspense } from "react";

export default function SigninPage() {
  return (
    <>
      <Suspense>
        <Signin />
      </Suspense>
    </>
  );
}
