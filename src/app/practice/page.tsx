import { Suspense } from "react";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Tutor from "@/components/Tutor";
import { getCurrentUser } from "@/lib/auth";

export default function PracticePage() {
  return (
    <Suspense>
      <Practice />
    </Suspense>
  );
}

async function Practice() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader user={user} />
      <div className="min-h-0 flex-1">
        <Tutor />
      </div>
    </div>
  );
}
