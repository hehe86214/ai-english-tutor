import { Suspense } from "react";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import LessonLibrary from "@/components/lessons/LessonLibrary";
import { getCurrentUser } from "@/lib/auth";
import { getMyLessonProgress } from "@/lib/history";

export default function LessonsPage() {
  return (
    <Suspense>
      <Lessons />
    </Suspense>
  );
}

async function Lessons() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const progress = await getMyLessonProgress(user.id);

  return (
    <>
      <AppHeader user={user} />
      <LessonLibrary progress={progress} />
    </>
  );
}
