"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Course, Lesson } from "@/content/lessons";
import type { LessonProgress } from "@/lib/history";
import ChatRoom from "../chat/ChatRoom";
import SpeakButton from "../chat/SpeakButton";
import { getDialogueVoices, speakSequence, stopSpeaking, useSpeechSupport } from "../chat/speech";
import { usePracticeChat } from "../chat/usePracticeChat";
import { COURSE_IMAGES } from "../ui/level";
import { LevelBadge } from "./LessonLibrary";

type Props = {
  lesson: Lesson;
  course: Course;
  lessonNumber: number;
  nextLesson: Lesson | null;
  progress: LessonProgress[string] | null;
};

export default function LessonView(props: Props) {
  const { lesson, course } = props;
  const [inClass, setInClass] = useState(false);
  const chat = usePracticeChat();

  function startClass() {
    setInClass(true);
    chat.start({ lessonId: lesson.id });
  }

  if (inClass) {
    return (
      <ChatRoom
        chat={chat}
        emoji={course.emoji}
        title={`${lesson.title} · ${lesson.titleEn}`}
        subtitle={`${course.title} Lesson ${props.lessonNumber} · ${lesson.level} · AI 老師一對一`}
        onBack={() => {
          setInClass(false);
          chat.reset();
        }}
        backLabel="回到教材"
        canComplete
        completedSlot={<CompletedCard {...props} onRetake={startClass} />}
      />
    );
  }

  return <LessonPrep {...props} onStart={startClass} />;
}

function LessonPrep({
  lesson,
  course,
  lessonNumber,
  progress,
  onStart,
}: Props & { onStart: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-dots">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm font-bold text-muted">
          <Link href="/lessons" className="transition hover:text-ink">
            教材庫
          </Link>
          <span className="text-faint">›</span>
          <span>{course.title}</span>
          <span className="text-faint">›</span>
          <span className="text-ink">Lesson {lessonNumber}</span>
        </nav>

        <header className="relative isolate mt-5 overflow-hidden rounded-[32px] border-[6px] border-sun px-6 py-10 shadow-[0_24px_60px_-30px_rgb(30_31_85/0.6)] sm:px-10 sm:py-14">
          <Image
            src={COURSE_IMAGES[course.id]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14134a]/95 via-[#14134a]/75 to-[#14134a]/30" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">
              {course.emoji} {course.title} · Lesson {lessonNumber}
            </span>
            <LevelBadge level={lesson.level} />
            {progress?.completed && (
              <span className="rounded-full bg-leaf px-2.5 py-0.5 text-[11px] font-black text-white">
                ✓ 已完成
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight font-black text-white sm:text-6xl">
            {lesson.title}
          </h1>
          <p className="mt-1 text-xl font-bold text-white/80 sm:text-2xl">{lesson.titleEn}</p>
          <div className="mt-6 inline-flex max-w-2xl items-start gap-3 bg-sunrise px-4 py-3 text-white shadow-[0_12px_30px_-12px_var(--flame)]">
            <span className="text-xs font-black tracking-wider whitespace-nowrap uppercase">本課目標</span>
            <span className="font-black">{lesson.goal}</span>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <Section step={1} title="單字" subtitle="Vocabulary">
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.vocabulary.map((v) => (
                  <div
                    key={v.word}
                    className="rounded-[22px] border-2 border-line bg-surface p-4 transition hover:border-sun"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-accent dark:text-ink">{v.word}</span>
                      <span className="rounded-md bg-sunken px-1.5 py-0.5 text-[11px] font-bold text-muted">
                        {v.pos}
                      </span>
                      <SpeakButton text={v.word} className="ml-auto" />
                    </div>
                    <p className="text-sm font-bold text-flame">{v.meaning}</p>
                    <div className="mt-3 flex items-start gap-1 border-t-2 border-dashed border-line pt-3">
                      <p className="flex-1 text-sm leading-relaxed font-semibold">{v.example}</p>
                      <SpeakButton text={v.example} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section step={2} title="關鍵句型" subtitle="Key phrases">
              <div className="space-y-4">
                {lesson.phrases.map((p) => (
                  <div key={p.pattern} className="overflow-hidden rounded-[24px] border-2 border-line bg-surface">
                    <div className="border-b-2 border-line bg-sun-soft px-5 py-4">
                      <p className="font-display text-2xl leading-snug font-black text-accent dark:text-ink">
                        {p.pattern}
                      </p>
                      <p className="mt-1 text-sm font-bold text-muted">{p.meaning}</p>
                    </div>
                    <ul className="space-y-2 p-4">
                      {p.examples.map((ex) => (
                        <li
                          key={ex}
                          className="flex items-center gap-2 rounded-2xl bg-sunken px-3.5 py-2.5 text-[15px] font-semibold"
                        >
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-[10px] text-white">
                            ✓
                          </span>
                          <span className="flex-1">{ex}</span>
                          <SpeakButton text={ex} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section step={3} title="範例對話" subtitle="Model dialogue">
              <Dialogue lesson={lesson} />
            </Section>

            <Section step={4} title="上課流程" subtitle="Lesson plan">
              <ol className="space-y-2.5">
                {lesson.tasks.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-2xl border-2 border-line bg-surface px-4 py-3 text-sm"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent font-black text-accent-ink">
                      {i + 1}
                    </span>
                    <span className="pt-1 leading-relaxed font-semibold text-muted">{t}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <div className="mt-10 lg:hidden">
              <StartButton onStart={onStart} retake={!!progress} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 overflow-hidden rounded-[28px] border-[5px] border-sun bg-surface shadow-[0_24px_50px_-28px_rgb(30_31_85/0.55)]">
              <div className="bg-accent px-6 py-5 text-accent-ink dark:bg-sunken dark:text-ink">
                <p className="text-xs font-black tracking-[0.2em] text-sun uppercase">Ready?</p>
                <p className="mt-1 font-display text-2xl font-black">預習完了，開始上課吧！</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm font-bold">
                  {[
                    ["等級", lesson.level],
                    ["時間", `約 ${lesson.minutes} 分鐘`],
                    ["單字／句型", `${lesson.vocabulary.length} 個／${lesson.phrases.length} 個`],
                    ["上過", `${progress?.sessionCount ?? 0} 次`],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="text-muted">{k}</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <StartButton onStart={onStart} retake={!!progress} />
                </div>
                <p className="mt-3 text-center text-xs font-bold text-faint">
                  AI 老師會照上課流程一步步帶你練習
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StartButton({ onStart, retake }: { onStart: () => void; retake: boolean }) {
  return (
    <button
      onClick={onStart}
      className="group flex w-full items-center justify-center gap-2 rounded-full bg-sunrise px-6 py-4 text-lg font-black text-white shadow-[0_14px_30px_-12px_var(--flame)] transition hover:-translate-y-0.5"
    >
      {retake ? "再上一次" : "開始上課"}
      <span className="transition group-hover:translate-x-1">▶</span>
    </button>
  );
}

function Section({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-sun font-display text-xl font-black text-sun-ink shadow-[0_8px_18px_-8px_var(--flame)]">
          {step}
        </span>
        <h2 className="font-display text-2xl font-black text-accent dark:text-ink">{title}</h2>
        <span className="text-sm font-black tracking-wider text-faint uppercase">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function Dialogue({ lesson }: { lesson: Lesson }) {
  const [showZh, setShowZh] = useState(true);
  const { tts } = useSpeechSupport();
  const { roles, lines } = lesson.dialogue;

  function playAll() {
    const [voiceA, voiceB] = getDialogueVoices();
    speakSequence(
      lines.map((l) => l.text),
      lines.map((l) => (l.speaker === "A" ? voiceA : voiceB)),
    );
  }

  return (
    <div className="rounded-[28px] border-2 border-line bg-surface p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tts && (
          <>
            <button
              onClick={playAll}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-black text-accent-ink transition hover:bg-accent-hover"
            >
              ▶ 播放整段對話
            </button>
            <button
              onClick={stopSpeaking}
              className="rounded-full border-2 border-line px-4 py-2 text-sm font-bold text-muted transition hover:text-ink"
            >
              停止
            </button>
          </>
        )}
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-muted">
          <input
            type="checkbox"
            checked={showZh}
            onChange={(e) => setShowZh(e.target.checked)}
            className="size-4 accent-[var(--flame)]"
          />
          顯示中文翻譯
        </label>
      </div>
      <div className="space-y-4">
        {lines.map((line, i) => {
          const isA = line.speaker === "A";
          return (
            <div key={i} className={`flex items-start gap-3 ${isA ? "" : "flex-row-reverse"}`}>
              <span
                className={`mt-5 grid size-10 shrink-0 place-items-center rounded-full text-xs font-black ${
                  isA ? "bg-sun text-sun-ink" : "bg-accent text-accent-ink"
                }`}
                title={roles[line.speaker]}
              >
                {roles[line.speaker].slice(0, 2)}
              </span>
              <div className={`flex max-w-[82%] flex-col ${isA ? "items-start" : "items-end"}`}>
                <span className="mb-1 text-xs font-black text-faint">{roles[line.speaker]}</span>
                <div
                  className={`flex items-start gap-1 rounded-3xl px-4 py-3 ${
                    isA ? "rounded-tl-md bg-sun-soft" : "rounded-tr-md bg-accent-soft"
                  }`}
                >
                  <div>
                    <p className="text-[15px] leading-relaxed font-bold">{line.text}</p>
                    {showZh && <p className="mt-0.5 text-[13px] font-medium text-muted">{line.zh}</p>}
                  </div>
                  <SpeakButton text={line.text} className="-mr-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompletedCard({
  lesson,
  nextLesson,
  onRetake,
}: Props & { onRetake: () => void }) {
  return (
    <div className="animate-rise mx-auto w-full max-w-md overflow-hidden rounded-[32px] border-[5px] border-sun bg-surface text-center shadow-[0_30px_60px_-30px_rgb(30_31_85/0.6)]">
      <div className="bg-sunrise px-6 py-6 text-white">
        <p className="text-4xl">🎉</p>
        <p className="mt-1 font-display text-3xl font-black">課程完成！</p>
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-muted">
          「{lesson.title}」已記錄到你的學習進度，對話和糾錯也都存在練習紀錄裡。
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="rounded-full bg-accent px-5 py-3 font-black text-accent-ink transition hover:bg-accent-hover"
            >
              下一課：{nextLesson.title} ▶
            </Link>
          )}
          <div className="flex gap-2">
            <button
              onClick={onRetake}
              className="flex-1 rounded-full border-2 border-line px-4 py-2.5 text-sm font-bold text-muted transition hover:border-sun hover:text-ink"
            >
              再上一次
            </button>
            <Link
              href="/lessons"
              className="flex-1 rounded-full border-2 border-line px-4 py-2.5 text-sm font-bold text-muted transition hover:border-sun hover:text-ink"
            >
              回教材庫
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
