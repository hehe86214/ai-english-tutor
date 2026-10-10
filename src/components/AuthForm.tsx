"use client";

import Link from "next/link";
import Brand from "./Brand";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.replace("/practice");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition placeholder:text-faint focus:border-accent/50 focus:ring-4 focus:ring-accent/10";

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <section className="flex flex-col px-6 py-8 sm:px-10">
        <Brand />
        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight">
            {isSignup ? "開始你的第一場對話" : "歡迎回來"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isSignup ? "註冊免費，30 秒就能開始練習。" : "登入繼續練習，回顧你的對話紀錄。"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <label className="block text-sm font-medium">
                名字
                <input
                  name="name"
                  required
                  maxLength={50}
                  placeholder="怎麼稱呼你？"
                  className={inputClass}
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              密碼
              <input
                name="password"
                type="password"
                required
                minLength={isSignup ? 8 : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? "至少 8 個字元" : "••••••••"}
                className={inputClass}
              />
            </label>

            {error && (
              <p className="rounded-xl bg-rose-soft px-3 py-2 text-sm text-rose">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent py-3 font-medium text-accent-ink transition hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "處理中…" : isSignup ? "建立帳號" : "登入"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? "已經有帳號了？" : "還沒有帳號？"}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="ml-1 font-medium text-accent underline-offset-4 hover:underline"
            >
              {isSignup ? "登入" : "免費註冊"}
            </Link>
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-accent lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-accent-ink/10 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-md space-y-4">
          <div className="w-fit max-w-[85%] rounded-3xl rounded-bl-md bg-accent-ink/95 px-4 py-3 text-[15px] text-ink shadow-xl">
            Hi! Welcome in. What can I get started for you today? ☕
          </div>
          <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-md bg-accent-ink/20 px-4 py-3 text-[15px] text-accent-ink ring-1 ring-accent-ink/25">
            I want a latte, and can I have it less sweet?
          </div>
          <div className="ml-auto w-fit max-w-[90%] rounded-2xl bg-accent-ink/95 px-4 py-3 text-sm text-ink shadow-xl">
            <p className="text-xs font-semibold text-accent">更好的說法</p>
            <p className="mt-1 font-display text-lg leading-snug">
              “Could I get a latte with less sugar, please?”
            </p>
          </div>
          <p className="pt-10 font-display text-3xl leading-snug text-accent-ink">
            每天一場對話，<br />
            <span className="italic">speak with confidence.</span>
          </p>
        </div>
      </aside>
    </main>
  );
}
