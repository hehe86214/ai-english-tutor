"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES, LESSONS, LEVELS, type Level } from "@/content/lessons";
import type { LessonProgress } from "@/lib/history";

export function LevelBadge({ level }: { level: Level }) {
  const label = LEVELS.find((l) => l.id === level)?.label;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sunken px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">
      <span className="font-semibold text-ink">{level}</span>
      {label}
    </span>
  );
}

export default function LessonLibrary({ progress }: { progress: LessonProgress }) {
  const [level, setLevel] = useState<Level | "all">("all");

  const completedCount = LESSONS.filter((l) => progress[l.id]?.completed).length;
  const percent = Math.round((completedCount / LESSONS.length) * 100);

  const courses = COURSES.map((course) => ({
    course,
    lessons: LESSONS.filter(
      (l) => l.courseId === course.id && (level === "all" || l.level === level),
    ),
  })).filter((c) => c.lessons.length > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-12 pb-20 sm:px-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Course library</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            教材庫
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            依 CEFR 等級編排的 {LESSONS.length} 堂課。每堂課先預習單字、句型和範例對話，再由 AI 老師一對一帶你上課。
          </p>
        </div>
        <div className="w-full rounded-2xl border border-line bg-surface p-4 md:w-64">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">學習進度</span>
            <span className="font-display text-2xl">
              {completedCount}
              <span className="text-base text-faint"> / {LESSONS.length}</span>
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="等級">
        {([{ id: "all", label: "全部等級" }, ...LEVELS] as const).map((l) => {
          const active = level === l.id;
          return (
            <button
              key={l.id}
              role="tab"
              aria-selected={active}
              onClick={() => setLevel(l.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active
                  ? "bg-ink text-paper"
                  : "border border-line bg-surface text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {l.id === "all" ? l.label : `${l.id} ${l.label}`}
            </button>
          );
        })}
      </div>
      {level !== "all" && (
        <p className="mt-3 text-sm text-muted">
          {LEVELS.find((l) => l.id === level)?.description}
        </p>
      )}

      <div className="mt-10 space-y-12">
        {courses.map(({ course, lessons }) => (
          <section key={course.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-surface text-2xl ring-1 ring-line">
                {course.emoji}
              </span>
              <div>
                <h2 className="text-lg font-semibold">
                  {course.title}
                  <span className="ml-2 font-display text-base font-normal text-muted italic">
                    {course.titleEn}
                  </span>
                </h2>
                <p className="text-sm text-muted">{course.description}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => {
                const p = progress[lesson.id];
                const number = LESSONS.filter((l) => l.courseId === course.id).indexOf(lesson) + 1;
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_10px_30px_-14px_rgb(0_0_0/0.2)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-faint">Lesson {number}</span>
                      <LevelBadge level={lesson.level} />
                    </div>
                    <p className="mt-3 font-semibold">{lesson.title}</p>
                    <p className="font-display text-[17px] text-muted italic">{lesson.titleEn}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{lesson.goal}</p>
                    <div className="mt-auto flex items-center justify-between pt-5 text-xs">
                      <span className="text-faint">約 {lesson.minutes} 分鐘</span>
                      {p?.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
                          ✓ 已完成
                        </span>
                      ) : p ? (
                        <span className="rounded-full bg-amber-soft px-2.5 py-1 text-amber">
                          上過 {p.sessionCount} 次
                        </span>
                      ) : (
                        <span className="text-accent opacity-0 transition group-hover:opacity-100">
                          開始學習 →
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
