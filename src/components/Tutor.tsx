"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SCENARIOS, type Scenario } from "@/lib/scenarios";
import { GrammarCard, SuggestionCard } from "./FeedbackCards";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type GrammarFeedback = {
  corrected: string;
  hasErrors: boolean;
  issues: {
    id: string;
    category: string;
    original: string;
    corrected: string;
    explanation: string;
  }[];
};

type ImproveFeedback = {
  improved: string;
  explanation: string;
};

type FeedbackKind = "grammar" | "improve";

type FeedbackState<T> = { loading: boolean; error?: string; data?: T };

type MessageFeedback = {
  grammar?: FeedbackState<GrammarFeedback>;
  improve?: FeedbackState<ImproveFeedback>;
};

export default function Tutor() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 每則使用者訊息的「糾正文法」「更好的回答」結果，key 是 messageId
  const [feedback, setFeedback] = useState<Record<string, MessageFeedback>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 登入過期時回到登入頁
  function goToLogin() {
    router.replace("/login");
  }

  async function startSession(next: Scenario) {
    setScenario(next);
    setSessionId(null);
    setMessages([]);
    setFeedback({});
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: next.id }),
      });
      const data = await res.json();
      if (res.status === 401) return goToLogin();
      if (!res.ok) throw new Error(data.error);
      setSessionId(data.sessionId);
      setMessages([data.message]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || !sessionId || loading) return;

    const pendingId = `pending-${Date.now()}`;
    setMessages((prev) => [...prev, { id: pendingId, role: "user", content }]);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.status === 401) return goToLogin();
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingId),
        data.userMessage,
        data.reply,
      ]);
    } catch (err) {
      // 送出失敗：拿掉剛剛那則訊息，把文字放回輸入框
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setInput(content);
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  async function requestFeedback(messageId: string, kind: FeedbackKind) {
    if (!sessionId) return;
    const update = (state: FeedbackState<GrammarFeedback | ImproveFeedback>) =>
      setFeedback((prev) => ({
        ...prev,
        [messageId]: { ...prev[messageId], [kind]: state },
      }));

    update({ loading: true });
    try {
      const res = await fetch(
        `/api/sessions/${sessionId}/messages/${messageId}/${kind}`,
        { method: "POST" },
      );
      const data = await res.json();
      if (res.status === 401) return goToLogin();
      if (!res.ok) throw new Error(data.error);
      update({ loading: false, data });
    } catch (err) {
      update({
        loading: false,
        error: err instanceof Error ? err.message : "發生錯誤",
      });
    }
  }

  function backToScenarios() {
    setScenario(null);
    setSessionId(null);
    setMessages([]);
    setFeedback({});
    setInput("");
    setError(null);
  }

  if (!scenario) {
    return (
      <main className="h-full overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Choose a scene
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            今天想練習<span className="italic">哪一種</span>對話？
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            選一個場景，AI 會用對應的角色先開口。每一句你說的話，都可以請它幫你糾正文法、給你更好的說法。
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => startSession(s)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="group animate-rise flex flex-col items-start rounded-2xl border border-line bg-surface p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.18)] focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-sunken text-2xl transition group-hover:scale-105 group-hover:bg-accent-soft">
                  {s.emoji}
                </span>
                <span className="mt-5 font-semibold">{s.label}</span>
                <span className="mt-1 text-sm text-muted">{s.description}</span>
                <span className="mt-4 text-xs font-medium text-accent opacity-0 transition group-hover:opacity-100">
                  開始對話 →
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col">
      <div className="border-b border-line bg-surface/60">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={backToScenarios}
            className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-sunken hover:text-ink"
            aria-label="換場景"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="grid size-10 place-items-center rounded-full bg-sunken text-xl">
            {scenario.emoji}
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-tight">{scenario.label}</p>
            <p className="truncate text-xs text-muted">{scenario.description}</p>
          </div>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent sm:flex">
            <span className="size-1.5 rounded-full bg-accent" />
            練習中
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
          {messages.map((m) =>
            m.role === "assistant" ? (
              <div key={m.id} className="animate-rise flex items-end gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-base">
                  {scenario.emoji}
                </span>
                <div className="max-w-[78%] rounded-3xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={m.id} className="animate-rise flex flex-col items-end gap-2">
                <div className="max-w-[78%] rounded-3xl rounded-br-md bg-accent px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-accent-ink">
                  {m.content}
                </div>
                {!m.id.startsWith("pending-") && (
                  <FeedbackPanel
                    feedback={feedback[m.id]}
                    onRequest={(kind) => requestFeedback(m.id, kind)}
                  />
                )}
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-end gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-base">
                {scenario.emoji}
              </span>
              <div className="flex items-center gap-1 rounded-3xl rounded-bl-md border border-line bg-surface px-4 py-4">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    style={{ animationDelay: `${delay}ms` }}
                    className="animate-dot size-1.5 rounded-full bg-muted"
                  />
                ))}
                {messages.length === 0 && (
                  <span className="ml-2 text-xs text-muted">正在準備對話…</span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-rose-soft px-4 py-2 text-sm text-rose">
              <span>{error}</span>
              {!sessionId && (
                <button
                  onClick={() => startSession(scenario)}
                  className="font-medium underline underline-offset-2"
                >
                  重試
                </button>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-line bg-paper/90 backdrop-blur">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 px-4 py-4 sm:px-6"
        >
          <div className="flex flex-1 items-end rounded-3xl border border-line bg-surface px-4 py-2 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter 送出，Shift+Enter 換行（中文輸入法選字時不送出）
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={sessionId ? "Type your reply in English…" : ""}
              disabled={!sessionId}
              maxLength={1000}
              rows={1}
              className="max-h-40 min-h-7 flex-1 resize-none bg-transparent py-1 text-[15px] leading-relaxed outline-none [field-sizing:content] placeholder:text-faint disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!sessionId || loading || !input.trim()}
            aria-label="送出"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition hover:bg-accent-hover disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <p className="pb-3 text-center text-[11px] text-faint">
          Enter 送出 · Shift + Enter 換行
        </p>
      </div>
    </main>
  );
}

function FeedbackPanel({
  feedback,
  onRequest,
}: {
  feedback?: MessageFeedback;
  onRequest: (kind: FeedbackKind) => void;
}) {
  const grammar = feedback?.grammar;
  const improve = feedback?.improve;
  const pill =
    "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition hover:border-accent/40 hover:text-ink disabled:cursor-default disabled:opacity-60 disabled:hover:border-line disabled:hover:text-muted";

  return (
    <div className="flex w-full max-w-[78%] flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {!grammar?.data && (
          <button onClick={() => onRequest("grammar")} disabled={grammar?.loading} className={pill}>
            <span className="size-1.5 rounded-full bg-amber" />
            {grammar?.loading ? "檢查中…" : "糾正文法"}
          </button>
        )}
        {!improve?.data && (
          <button onClick={() => onRequest("improve")} disabled={improve?.loading} className={pill}>
            <span className="size-1.5 rounded-full bg-accent" />
            {improve?.loading ? "思考中…" : "更好的完整回答"}
          </button>
        )}
      </div>

      {grammar?.error && <p className="text-xs text-rose">{grammar.error}</p>}
      {grammar?.data && (
        <GrammarCard
          corrected={grammar.data.hasErrors ? grammar.data.corrected : undefined}
          issues={grammar.data.issues}
        />
      )}

      {improve?.error && <p className="text-xs text-rose">{improve.error}</p>}
      {improve?.data && (
        <SuggestionCard
          improved={improve.data.improved}
          explanation={improve.data.explanation}
        />
      )}
    </div>
  );
}
