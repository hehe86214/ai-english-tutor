"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course, Lesson } from "@/content/lessons";
import type { LessonProgress } from "@/lib/history";
import ChatRoom from "../chat/ChatRoom";
import SpeakButton from "../chat/SpeakButton";
import { getDialogueVoices, speakSequence, stopSpeaking, useSpeechSupport } from "../chat/speech";
import { usePracticeChat } from "../chat/usePracticeChat";
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
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted">
          <Link href="/lessons" className="transition hover:text-ink">
            教材庫
          </Link>
          <span className="text-faint">/</span>
          <span>{course.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-faint">
                  {course.emoji} {course.titleEn} · Lesson {lessonNumber}
                </span>
                <LevelBadge level={lesson.level} />
                {progress?.completed && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                    ✓ 已完成
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{lesson.title}</h1>
              <p className="mt-1 font-display text-2xl text-muted italic">{lesson.titleEn}</p>
              <div className="mt-6 rounded-2xl border border-accent/20 bg-accent-soft/60 px-5 py-4">
                <p className="text-xs font-semibold tracking-wide text-accent">本課目標</p>
                <p className="mt-1 leading-relaxed">{lesson.goal}</p>
              </div>
            </header>

            <Section step={1} title="單字" subtitle="Vocabulary">
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.vocabulary.map((v) => (
                  <div key={v.word} className="rounded-2xl border border-line bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">{v.word}</span>
                      <span className="text-xs text-faint italic">{v.pos}</span>
                      <SpeakButton text={v.word} className="ml-auto" />
                    </div>
                    <p className="text-sm text-muted">{v.meaning}</p>
                    <div className="mt-3 flex items-start gap-1 border-t border-line pt-3">
                      <p className="flex-1 text-sm leading-relaxed">{v.example}</p>
                      <SpeakButton text={v.example} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section step={2} title="關鍵句型" subtitle="Key phrases">
              <div className="space-y-3">
                {lesson.phrases.map((p) => (
                  <div key={p.pattern} className="rounded-2xl border border-line bg-surface p-5">
                    <p className="font-display text-2xl leading-snug">{p.pattern}</p>
                    <p className="mt-1 text-sm text-muted">{p.meaning}</p>
                    <ul className="mt-4 space-y-2">
                      {p.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 rounded-xl bg-sunken/70 px-3 py-2 text-[15px]">
                          <span className="size-1.5 shrink-0 rounded-full bg-accent" />
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
              <ol className="space-y-2">
                {lesson.tasks.map((t, i) => (
                  <li key={t} className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
                    <span className="font-display text-lg leading-none text-accent italic">{i + 1}</span>
                    <span className="leading-relaxed text-muted">{t}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <div className="mt-10 lg:hidden">
              <StartButton onStart={onStart} retake={!!progress} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-3xl border border-line bg-surface p-6">
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Ready?</p>
              <p className="mt-2 font-display text-2xl leading-snug">預習完了，開始上課吧</p>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                <li className="flex justify-between">
                  <span>等級</span>
                  <span className="text-ink">{lesson.level}</span>
                </li>
                <li className="flex justify-between">
                  <span>時間</span>
                  <span className="text-ink">約 {lesson.minutes} 分鐘</span>
                </li>
                <li className="flex justify-between">
                  <span>單字／句型</span>
                  <span className="text-ink">
                    {lesson.vocabulary.length} 個／{lesson.phrases.length} 個
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>上過</span>
                  <span className="text-ink">{progress?.sessionCount ?? 0} 次</span>
                </li>
              </ul>
              <div className="mt-6">
                <StartButton onStart={onStart} retake={!!progress} />
              </div>
              <p className="mt-3 text-center text-xs text-faint">
                AI 老師會照上課流程一步步帶你練習
              </p>
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
      className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_10px_30px_-12px_var(--accent)] transition hover:bg-accent-hover"
    >
      {retake ? "再上一次" : "開始上課"}
      <span className="transition group-hover:translate-x-0.5">→</span>
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
    <section className="mt-12">
      <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
        <span className="font-display text-3xl leading-none text-accent italic">0{step}</span>
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="font-display text-lg text-faint italic">{subtitle}</span>
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
    <div className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tts && (
          <>
            <button
              onClick={playAll}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper transition hover:opacity-85"
            >
              ▶ 播放整段對話
            </button>
            <button
              onClick={stopSpeaking}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:text-ink"
            >
              停止
            </button>
          </>
        )}
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={showZh}
            onChange={(e) => setShowZh(e.target.checked)}
            className="accent-[var(--accent)]"
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
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  isA ? "bg-sunken text-ink" : "bg-accent-soft text-accent"
                }`}
                title={roles[line.speaker]}
              >
                {roles[line.speaker].slice(0, 2)}
              </span>
              <div className={`flex max-w-[82%] flex-col ${isA ? "items-start" : "items-end"}`}>
                <span className="mb-1 text-[11px] text-faint">{roles[line.speaker]}</span>
                <div
                  className={`flex items-start gap-1 rounded-2xl px-4 py-2.5 ${
                    isA ? "rounded-tl-md bg-sunken/80" : "rounded-tr-md bg-accent-soft/70"
                  }`}
                >
                  <div>
                    <p className="text-[15px] leading-relaxed">{line.text}</p>
                    {showZh && <p className="mt-0.5 text-[13px] text-muted">{line.zh}</p>}
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
    <div className="animate-rise mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-6 text-center shadow-[0_20px_50px_-25px_rgb(0_0_0/0.3)]">
      <p className="text-3xl">🎉</p>
      <p className="mt-2 font-display text-2xl">課程完成！</p>
      <p className="mt-1 text-sm text-muted">
        「{lesson.title}」已記錄到你的學習進度，對話和糾錯也都存在練習紀錄裡。
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {nextLesson && (
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
          >
            下一課：{nextLesson.title} →
          </Link>
        )}
        <div className="flex gap-2">
          <button
            onClick={onRetake}
            className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:text-ink"
          >
            再上一次
          </button>
          <Link
            href="/lessons"
            className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:text-ink"
          >
            回教材庫
          </Link>
        </div>
      </div>
    </div>
  );
}
