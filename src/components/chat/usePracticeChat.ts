"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// 一場練習的前端狀態：開始、送訊息、糾錯／建議、完成課程
// 情境對話（Tutor）和教材課程（LessonView）共用

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type GrammarFeedback = {
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

export type ImproveFeedback = {
  improved: string;
  explanation: string;
};

export type FeedbackKind = "grammar" | "improve";

type FeedbackState<T> = { loading: boolean; error?: string; data?: T };

export type MessageFeedback = {
  grammar?: FeedbackState<GrammarFeedback>;
  improve?: FeedbackState<ImproveFeedback>;
};

export type StartPayload = { scenario: string } | { lessonId: string };

export function usePracticeChat() {
  const router = useRouter();
  const [startPayload, setStartPayload] = useState<StartPayload | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  // 每則使用者訊息的「糾正文法」「更好的回答」結果，key 是 messageId
  const [feedback, setFeedback] = useState<Record<string, MessageFeedback>>({});

  // 登入過期時回到登入頁
  function goToLogin() {
    router.replace("/login");
  }

  function reset() {
    setStartPayload(null);
    setSessionId(null);
    setMessages([]);
    setFeedback({});
    setError(null);
    setCompleted(false);
  }

  async function start(payload: StartPayload) {
    reset();
    setStartPayload(payload);
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // 回傳 false 代表送出失敗，呼叫端可以把文字放回輸入框
  async function send(content: string) {
    if (!content || !sessionId || loading || completed) return false;

    const pendingId = `pending-${Date.now()}`;
    setMessages((prev) => [...prev, { id: pendingId, role: "user", content }]);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.status === 401) {
        goToLogin();
        return false;
      }
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingId),
        data.userMessage,
        data.reply,
      ]);
      return true;
    } catch (err) {
      // 送出失敗：拿掉剛剛那則訊息
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setError(err instanceof Error ? err.message : "發生錯誤");
      return false;
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

  async function complete() {
    if (!sessionId) return;
    setError(null);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });
      const data = await res.json();
      if (res.status === 401) return goToLogin();
      if (!res.ok) throw new Error(data.error);
      setCompleted(true);
      // 讓教材列表的進度重新整理
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    }
  }

  function retry() {
    if (startPayload) start(startPayload);
  }

  return {
    sessionId,
    messages,
    loading,
    error,
    feedback,
    completed,
    start,
    send,
    requestFeedback,
    complete,
    retry,
    reset,
  };
}

export type PracticeChat = ReturnType<typeof usePracticeChat>;
