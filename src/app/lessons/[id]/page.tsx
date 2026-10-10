import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import LessonView from "@/components/lessons/LessonView";
import { getCourse, getCourseLessons, getLesson } from "@/content/lessons";
import { getCurrentUser } from "@/lib/auth";
import { getMyLessonProgress } from "@/lib/history";

export default function LessonPage(props: PageProps<"/lessons/[id]">) {
  return (
    <Suspense>
      <LessonPageContent params={props.params} />
    </Suspense>
  );
}

async function LessonPageContent({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const lesson = getLesson(id);
  const course = lesson && getCourse(lesson.courseId);
  if (!lesson || !course) notFound();

  const progress = await getMyLessonProgress(user.id);
  const siblings = getCourseLessons(course.id);
  const index = siblings.indexOf(lesson);

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader user={user} />
      <div className="min-h-0 flex-1">
        <LessonView
          lesson={lesson}
          course={course}
          lessonNumber={index + 1}
          nextLesson={siblings[index + 1] ?? null}
          progress={progress[lesson.id] ?? null}
        />
      </div>
    </div>
  );
}
