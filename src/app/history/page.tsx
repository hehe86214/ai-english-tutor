import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { listMySessions } from "@/lib/history";

export default function HistoryPage() {
  return (
    <Suspense>
      <History />
    </Suspense>
  );
}

async function History() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessions = await listMySessions(user.id);

  return (
    <>
      <AppHeader user={user} />
      <main className="flex-1 bg-dots">
       <div className="mx-auto w-full max-w-4xl px-4 pt-12 pb-20 sm:px-6">
        <p className="text-sm font-black tracking-[0.2em] text-flame uppercase">History</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h1 className="font-display text-5xl font-black text-accent sm:text-6xl dark:text-ink">練習紀錄</h1>
          {sessions.length > 0 && (
            <p className="mb-2 rounded-full bg-sun px-4 py-1.5 text-sm font-black text-sun-ink">共 {sessions.length} 場</p>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="mt-10 rounded-[28px] border-2 border-dashed border-line bg-surface px-6 py-16 text-center">
            <p className="text-4xl">📒</p>
            <p className="mt-3 font-display text-2xl font-black">還沒有練習紀錄</p>
            <p className="mt-2 text-sm font-medium text-muted">完成第一場對話後，紀錄會出現在這裡。</p>
            <Link
              href="/lessons"
              className="mt-6 inline-flex rounded-full bg-sunrise px-6 py-3 font-black text-white shadow-[0_12px_28px_-12px_var(--flame)] transition hover:-translate-y-0.5"
            >
              去上第一堂課 →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/history/${s.id}`}
                  className="group flex items-center gap-4 rounded-[24px] border-2 border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-sun hover:shadow-[0_18px_40px_-24px_rgb(30_31_85/0.5)] sm:p-5"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sun-soft text-2xl">
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-lg font-black">
                      {s.scenarioLabel}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                          s.isLesson ? "bg-accent text-accent-ink" : "bg-leaf text-white"
                        }`}
                      >
                        {s.isLesson ? "教材課程" : "情境對話"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-muted">{formatDateTime(s.createdAt)}</p>
                  </div>
                  <div className="hidden gap-2 text-xs font-black sm:flex">
                    <span className="rounded-full bg-sunken px-3 py-1 text-muted">
                      {s.messageCount} 則對話
                    </span>
                    {s.feedbackCount > 0 && (
                      <span className="rounded-full bg-amber-soft px-3 py-1 text-amber">
                        {s.feedbackCount} 筆糾錯／建議
                      </span>
                    )}
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-sunken font-black text-faint transition group-hover:translate-x-0.5 group-hover:bg-sun group-hover:text-sun-ink">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
       </div>
      </main>
    </>
  );
}
