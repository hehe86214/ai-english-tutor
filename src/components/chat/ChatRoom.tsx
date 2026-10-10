"use client";

import { useEffect, useRef, useState } from "react";
import { GrammarCard, SuggestionCard } from "../FeedbackCards";
import SpeakButton from "./SpeakButton";
import { useDictation, useSpeechSupport } from "./speech";
import type { FeedbackKind, MessageFeedback, PracticeChat } from "./usePracticeChat";

export default function ChatRoom({
  chat,
  emoji,
  title,
  subtitle,
  onBack,
  backLabel = "返回",
  canComplete = false,
  completedSlot,
}: {
  chat: PracticeChat;
  emoji: string;
  title: string;
  subtitle: string;
  onBack: () => void;
  backLabel?: string;
  // 教材課程才有「完成課程」按鈕
  canComplete?: boolean;
  completedSlot?: React.ReactNode;
}) {
  const { sessionId, messages, loading, error, feedback, completed } = chat;
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { stt } = useSpeechSupport();
  const dictation = useDictation(setInput);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, completed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;
    dictation.stop();
    setInput("");
    const ok = await chat.send(content);
    // 送出失敗：把文字放回輸入框
    if (!ok) setInput(content);
  }

  const userTurns = messages.filter((m) => m.role === "user" && !m.id.startsWith("pending-")).length;
  const inputDisabled = !sessionId || completed;

  return (
    <main className="flex h-full flex-col">
      <div className="border-b-2 border-line bg-surface">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={onBack}
            className="grid size-10 place-items-center rounded-full border-2 border-line text-muted transition hover:border-sun hover:text-ink"
            aria-label={backLabel}
            title={backLabel}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="grid size-11 place-items-center rounded-2xl bg-sun text-xl shadow-[0_8px_18px_-8px_var(--flame)]">{emoji}</span>
          <div className="min-w-0">
            <p className="truncate font-black leading-tight">{title}</p>
            <p className="truncate text-xs font-bold text-muted">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {canComplete && !completed && (
              <button
                onClick={chat.complete}
                disabled={!sessionId || userTurns === 0}
                title={userTurns === 0 ? "先跟老師對話幾句再完成課程" : undefined}
                className="rounded-full bg-sunrise px-4 py-2 text-xs font-black whitespace-nowrap text-white shadow-[0_8px_18px_-8px_var(--flame)] transition hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
              >
                完成課程
              </button>
            )}
            <span
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black sm:flex ${
                completed ? "bg-sunken text-muted" : "bg-leaf-soft text-leaf"
              }`}
            >
              <span className={`size-2 rounded-full ${completed ? "bg-faint" : "animate-pulse bg-leaf"}`} />
              {completed ? "已完成" : canComplete ? "上課中" : "練習中"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-dots">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
          {messages.map((m) =>
            m.role === "assistant" ? (
              <div key={m.id} className="animate-rise flex items-end gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun text-base shadow-[0_6px_14px_-6px_var(--flame)]">
                  {emoji}
                </span>
                <div className="max-w-[78%] rounded-[26px] rounded-bl-md border-2 border-line bg-surface px-4 py-3 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap shadow-[0_10px_24px_-18px_rgb(30_31_85/0.45)]">
                  {m.content}
                </div>
                <SpeakButton text={m.content} className="mb-1" />
              </div>
            ) : (
              <div key={m.id} className="animate-rise flex flex-col items-end gap-2">
                <div className="max-w-[78%] rounded-[26px] rounded-br-md bg-accent px-4 py-3 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap text-accent-ink shadow-[0_10px_24px_-14px_var(--accent)]">
                  {m.content}
                </div>
                {!m.id.startsWith("pending-") && (
                  <FeedbackPanel
                    feedback={feedback[m.id]}
                    onRequest={(kind) => chat.requestFeedback(m.id, kind)}
                  />
                )}
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-end gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun text-base">
                {emoji}
              </span>
              <div className="flex items-center gap-1 rounded-[26px] rounded-bl-md border-2 border-line bg-surface px-4 py-4">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    style={{ animationDelay: `${delay}ms` }}
                    className="animate-dot size-2 rounded-full bg-flame"
                  />
                ))}
                {messages.length === 0 && (
                  <span className="ml-2 text-xs font-bold text-muted">
                    {canComplete ? "老師正在準備課程…" : "正在準備對話…"}
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-rose-soft px-4 py-2 text-sm font-bold text-rose">
              <span>{error}</span>
              {!sessionId && (
                <button onClick={chat.retry} className="font-medium underline underline-offset-2">
                  重試
                </button>
              )}
            </div>
          )}

          {completed && completedSlot}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t-2 border-line bg-surface">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 px-4 py-4 sm:px-6"
        >
          <div className="flex flex-1 items-end gap-1 rounded-[26px] border-2 border-line bg-paper py-2 pr-2 pl-4 transition focus-within:border-sun focus-within:bg-surface focus-within:ring-4 focus-within:ring-sun/25">
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
              placeholder={
                completed
                  ? "這堂課已經完成"
                  : dictation.listening
                    ? "Listening… 請用英文說話"
                    : sessionId
                      ? "Type or speak your reply in English…"
                      : ""
              }
              disabled={inputDisabled}
              maxLength={1000}
              rows={1}
              className="max-h-40 min-h-7 flex-1 resize-none bg-transparent py-1 text-[15px] leading-relaxed font-semibold outline-none [field-sizing:content] placeholder:font-medium placeholder:text-faint disabled:opacity-50"
            />
            {stt && (
              <button
                type="button"
                onClick={() => (dictation.listening ? dictation.stop() : dictation.start(input))}
                disabled={inputDisabled}
                aria-label={dictation.listening ? "停止語音輸入" : "語音輸入"}
                title={dictation.listening ? "停止語音輸入" : "語音輸入（說英文）"}
                className={`grid size-9 shrink-0 place-items-center rounded-full transition disabled:opacity-30 ${
                  dictation.listening
                    ? "animate-pulse bg-rose text-white"
                    : "bg-accent-soft text-accent hover:bg-accent hover:text-accent-ink dark:text-ink"
                }`}
              >
                {dictation.listening ? (
                  <span className="size-2.5 rounded-sm bg-current" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden>
                    <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={inputDisabled || loading || !input.trim()}
            aria-label="送出"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sunrise text-white shadow-[0_10px_22px_-10px_var(--flame)] transition hover:-translate-y-0.5 disabled:opacity-35 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <p className="pb-3 text-center text-[11px] font-bold text-faint">
          Enter 送出 · Shift + Enter 換行{stt && " · 🎙 可以直接說英文"}
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
    "inline-flex items-center gap-1.5 rounded-full border-2 bg-surface px-3.5 py-1.5 text-xs font-black transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0";

  return (
    <div className="flex w-full max-w-[78%] flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {!grammar?.data && (
          <button
            onClick={() => onRequest("grammar")}
            disabled={grammar?.loading}
            className={`${pill} border-amber/40 text-amber hover:bg-amber-soft`}
          >
            <span>✏️</span>
            {grammar?.loading ? "檢查中…" : "糾正文法"}
          </button>
        )}
        {!improve?.data && (
          <button
            onClick={() => onRequest("improve")}
            disabled={improve?.loading}
            className={`${pill} border-leaf/40 text-leaf hover:bg-leaf-soft`}
          >
            <span>✨</span>
            {improve?.loading ? "思考中…" : "更好的完整回答"}
          </button>
        )}
      </div>

      {grammar?.error && <p className="text-xs font-bold text-rose">{grammar.error}</p>}
      {grammar?.data && (
        <GrammarCard
          corrected={grammar.data.hasErrors ? grammar.data.corrected : undefined}
          issues={grammar.data.issues}
        />
      )}

      {improve?.error && <p className="text-xs font-bold text-rose">{improve.error}</p>}
      {improve?.data && (
        <SuggestionCard improved={improve.data.improved} explanation={improve.data.explanation} />
      )}
    </div>
  );
}
