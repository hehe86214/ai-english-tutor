import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default function Page() {
  return (
    <Suspense>
      <RedirectIfLoggedIn />
    </Suspense>
  );
}

// 已經登入就直接回練習頁
async function RedirectIfLoggedIn() {
  if (await getCurrentUser()) redirect("/lessons");
  return <AuthForm mode="login" />;
}
