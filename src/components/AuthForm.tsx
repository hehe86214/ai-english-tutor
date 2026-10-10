"use client";

import Image from "next/image";
import Link from "next/link";
import Brand from "./Brand";
import { SuggestionCard } from "./FeedbackCards";
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
      router.replace("/lessons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-2xl border-2 border-line bg-surface px-4 py-3 text-[15px] font-semibold outline-none transition placeholder:font-medium placeholder:text-faint focus:border-sun focus:ring-4 focus:ring-sun/25";

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <section className="flex flex-col bg-dots px-6 py-6 sm:px-10">
        <Brand />
        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <span className="inline-flex rounded-full bg-sun-soft px-3 py-1 text-xs font-black tracking-wider text-flame uppercase">
            {isSignup ? "Create account" : "Welcome back"}
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight font-black text-accent dark:text-ink">
            {isSignup ? "開始你的第一堂課" : "歡迎回來"}
          </h1>
          <p className="mt-2 font-medium text-muted">
            {isSignup ? "註冊免費，30 秒就能開始上課。" : "登入繼續上課，回顧你的學習紀錄。"}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-[28px] border-2 border-line bg-surface p-6 shadow-[0_20px_50px_-30px_rgb(30_31_85/0.45)]"
          >
            {isSignup && (
              <label className="block text-sm font-black">
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
            <label className="block text-sm font-black">
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
            <label className="block text-sm font-black">
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
              <p className="rounded-2xl bg-rose-soft px-3 py-2 text-sm font-bold text-rose">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-sunrise py-3.5 text-lg font-black text-white shadow-[0_12px_28px_-12px_var(--flame)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "處理中…" : isSignup ? "免費建立帳號" : "登入"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-muted">
            {isSignup ? "已經有帳號了？" : "還沒有帳號？"}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="ml-1 font-black text-accent underline-offset-4 hover:underline dark:text-sun"
            >
              {isSignup ? "登入" : "免費註冊"}
            </Link>
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-accent lg:flex lg:items-center lg:justify-center lg:p-14 dark:bg-surface">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-sun/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-flame/30 blur-3xl" />
        <div className="relative w-full max-w-md">
         <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border-[6px] border-sun shadow-2xl">
            <Image src="/images/auth.jpg" alt="" fill sizes="40vw" className="object-cover" priority />
          </div>
          <div className="absolute -top-6 -left-8 max-w-[15rem] rounded-3xl rounded-bl-md bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-xl">
            <p className="mb-1 text-xs font-black text-flame">AI 老師</p>
            Hi! What can I get started for you today? ☕
          </div>
          <div className="absolute -right-6 -bottom-10 max-w-[17rem]">
            <SuggestionCard
              improved="Could I get a latte with less sugar, please?"
              explanation="用 Could I get… 點餐更自然有禮貌。"
            />
          </div>
         </div>
          <h2 className="mt-24 font-display text-4xl leading-tight font-black text-white">
            每天一堂課，
            <br />
            <span className="text-sun">speak with confidence.</span>
          </h2>
        </div>
      </aside>
    </main>
  );
}
