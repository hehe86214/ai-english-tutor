import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { GrammarCard, SuggestionCard } from "@/components/FeedbackCards";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getMySession, type FeedbackItem } from "@/lib/history";

export default function SessionHistoryPage(props: PageProps<"/history/[id]">) {
  return (
    <Suspense>
      <SessionHistory params={props.params} />
    </Suspense>
  );
}

async function SessionHistory({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  // 只查自己的練習；別人的練習 id 會得到 null → 404
  const session = await getMySession(user.id, id);
  if (!session) notFound();

  const feedbackCount = session.messages.reduce((n, m) => n + m.feedback.length, 0);

  return (
    <>
      <AppHeader user={user} />
      <main className="flex-1 bg-dots">
       <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-20 sm:px-6">
        <Link
          href="/history"
          className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-surface px-4 py-1.5 text-sm font-bold text-muted transition hover:border-sun hover:text-ink"
        >
          ← 練習紀錄
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-sun text-3xl shadow-[0_10px_22px_-10px_var(--flame)]">
            {session.emoji}
          </span>
          <div>
            <h1 className="font-display text-4xl leading-tight font-black text-accent dark:text-ink">{session.scenarioLabel}</h1>
            <p className="text-sm font-bold text-muted">
              {formatDateTime(session.createdAt)} · {session.messages.length} 則對話
              {feedbackCount > 0 && ` · ${feedbackCount} 筆糾錯／建議`}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5 rounded-[28px] border-2 border-line bg-surface/70 p-4 sm:p-6">
          {session.messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex flex-col items-end gap-2">
                <div className="max-w-[78%] rounded-[26px] rounded-br-md bg-accent px-4 py-3 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap text-accent-ink">
                  {m.content}
                </div>
                {m.feedback.length > 0 && <FeedbackList items={m.feedback} />}
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun text-base">
                  {session.emoji}
                </span>
                <div className="max-w-[78%] rounded-[26px] rounded-bl-md border-2 border-line bg-surface px-4 py-3 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ),
          )}
        </div>
       </div>
      </main>
    </>
  );
}

function FeedbackList({ items }: { items: FeedbackItem[] }) {
  const corrections = items.filter((f) => f.type === "correction");
  const suggestions = items.filter((f) => f.type === "suggestion");

  return (
    <div className="flex w-full max-w-[78%] flex-col gap-2">
      {corrections.length > 0 && <GrammarCard issues={corrections} />}
      {suggestions.map((f) => (
        <SuggestionCard key={f.id} improved={f.corrected} explanation={f.explanation} />
      ))}
    </div>
  );
}
