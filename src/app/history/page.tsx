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
      <main className="mx-auto w-full max-w-3xl px-4 pt-12 pb-20 sm:px-6">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">History</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl sm:text-5xl">練習紀錄</h1>
          {sessions.length > 0 && (
            <p className="pb-1.5 text-sm text-muted">共 {sessions.length} 場</p>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-2xl">還沒有練習紀錄</p>
            <p className="mt-2 text-sm text-muted">完成第一場對話後，紀錄會出現在這裡。</p>
            <Link
              href="/practice"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
            >
              去練習一場 →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/history/${s.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_10px_30px_-14px_rgb(0_0_0/0.2)] sm:p-5"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sunken text-2xl">
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.scenarioLabel}</p>
                    <p className="mt-0.5 text-xs text-muted">{formatDateTime(s.createdAt)}</p>
                  </div>
                  <div className="hidden gap-2 text-xs sm:flex">
                    <span className="rounded-full bg-sunken px-2.5 py-1 text-muted">
                      {s.messageCount} 則對話
                    </span>
                    {s.feedbackCount > 0 && (
                      <span className="rounded-full bg-amber-soft px-2.5 py-1 text-amber">
                        {s.feedbackCount} 筆糾錯／建議
                      </span>
                    )}
                  </div>
                  <span className="text-faint transition group-hover:translate-x-0.5 group-hover:text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
