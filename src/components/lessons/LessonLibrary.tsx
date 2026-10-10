"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COURSES, LESSONS, LEVELS, type Level } from "@/content/lessons";
import type { LessonProgress } from "@/lib/history";
import { COURSE_IMAGES, LEVEL_PILL } from "../ui/level";

export function LevelBadge({ level }: { level: Level }) {
  const label = LEVELS.find((l) => l.id === level)?.label;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${LEVEL_PILL[level]}`}
    >
      {level} {label}
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
    <main className="bg-dots">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-20 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-flame uppercase">Course library</p>
            <h1 className="mt-2 font-display text-5xl font-black text-accent sm:text-6xl dark:text-ink">
              教材庫
            </h1>
            <p className="mt-5 inline-block bg-sunrise px-4 py-1.5 font-display text-lg font-black text-white shadow-[0_10px_24px_-12px_var(--flame)] sm:text-xl">
              {LESSONS.length} 堂 CEFR 系統課程，先預習再上課
            </p>
          </div>
          <div className="w-full rounded-[24px] border-2 border-line bg-surface p-5 shadow-[0_16px_40px_-28px_rgb(30_31_85/0.5)] md:w-72">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-black text-muted">我的學習進度</span>
              <span className="font-display text-3xl font-black text-accent dark:text-ink">
                {completedCount}
                <span className="text-base text-faint"> / {LESSONS.length}</span>
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-sunken">
              <div className="h-full rounded-full bg-sunrise transition-all" style={{ width: `${Math.max(percent, 3)}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold text-muted">
              {completedCount === 0 ? "從第一堂課開始吧！" : `已完成 ${percent}%，繼續加油！`}
            </p>
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
                className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                  active
                    ? l.id === "all"
                      ? "bg-accent text-accent-ink shadow-lg"
                      : `${LEVEL_PILL[l.id]} shadow-lg`
                    : "border-2 border-line bg-surface text-muted hover:border-sun hover:text-ink"
                }`}
              >
                {l.id === "all" ? l.label : `Level ${l.id} ${l.label}`}
              </button>
            );
          })}
        </div>
        {level !== "all" && (
          <p className="mt-3 text-sm font-bold text-muted">
            {LEVELS.find((l) => l.id === level)?.description}
          </p>
        )}

        <div className="mt-12 space-y-14">
          {courses.map(({ course, lessons }) => (
            <section key={course.id} className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <div className="relative isolate flex min-h-52 flex-col justify-end overflow-hidden rounded-[28px] border-[5px] border-sun p-5 shadow-[0_18px_40px_-22px_rgb(30_31_85/0.55)]">
                <Image
                  src={COURSE_IMAGES[course.id]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="-z-10 object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#14134a]/90 via-[#14134a]/40 to-transparent" />
                <span className="text-3xl drop-shadow">{course.emoji}</span>
                <h2 className="mt-1 font-display text-3xl font-black text-white">{course.title}</h2>
                <p className="text-sm font-bold text-white/80">{course.titleEn}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{course.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {lessons.map((lesson) => {
                  const p = progress[lesson.id];
                  const number = LESSONS.filter((l) => l.courseId === course.id).indexOf(lesson) + 1;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="group flex flex-col rounded-[24px] border-2 border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-sun hover:shadow-[0_18px_40px_-22px_rgb(30_31_85/0.5)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="grid size-10 place-items-center rounded-2xl bg-sun-soft font-display text-lg font-black text-flame">
                          {number}
                        </span>
                        <LevelBadge level={lesson.level} />
                      </div>
                      <p className="mt-4 text-lg font-black">{lesson.title}</p>
                      <p className="text-sm font-bold text-muted">{lesson.titleEn}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{lesson.goal}</p>
                      <div className="mt-auto flex items-center justify-between pt-5 text-xs font-black">
                        <span className="text-faint">⏱ 約 {lesson.minutes} 分鐘</span>
                        {p?.completed ? (
                          <span className="rounded-full bg-leaf px-3 py-1 text-white">✓ 已完成</span>
                        ) : p ? (
                          <span className="rounded-full bg-sun px-3 py-1 text-sun-ink">
                            上過 {p.sessionCount} 次
                          </span>
                        ) : (
                          <span className="rounded-full bg-accent-soft px-3 py-1 text-accent transition group-hover:bg-accent group-hover:text-accent-ink dark:text-ink">
                            開始學習 ▶
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
      </div>
    </main>
  );
}
