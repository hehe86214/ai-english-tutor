"use client";

import { useState } from "react";
import { SCENARIOS, type Scenario } from "@/lib/scenarios";
import ChatRoom from "./chat/ChatRoom";
import { usePracticeChat } from "./chat/usePracticeChat";

// 情境對話：先選場景，再進入對話
export default function Tutor() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const chat = usePracticeChat();

  function choose(next: Scenario) {
    setScenario(next);
    chat.start({ scenario: next.id });
  }

  function backToScenarios() {
    setScenario(null);
    chat.reset();
  }

  if (!scenario) {
    return (
      <main className="h-full overflow-y-auto bg-dots">
        <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-14">
          <p className="text-sm font-black tracking-[0.2em] text-flame uppercase">Free talk</p>
          <h1 className="mt-2 font-display text-5xl font-black text-accent sm:text-6xl dark:text-ink">
            情境對話
          </h1>
          <p className="mt-5 inline-block bg-sunrise px-4 py-1.5 font-display text-lg font-black text-white shadow-[0_10px_24px_-12px_var(--flame)] sm:text-xl">
            選一個場景，AI 用對應的角色先開口
          </p>
          <p className="mt-5 max-w-xl font-medium text-muted">
            不照教材、想聊什麼就聊什麼。每一句你說的話，都可以請 AI 糾正文法、給你更好的說法。
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => choose(s)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="group animate-rise flex flex-col items-start rounded-[26px] border-2 border-line bg-surface p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-sun hover:shadow-[0_18px_40px_-22px_rgb(30_31_85/0.5)] focus-visible:outline-2 focus-visible:outline-sun"
              >
                <span
                  className={`grid size-14 place-items-center rounded-2xl text-3xl transition group-hover:scale-110 ${
                    ["bg-sun-soft", "bg-leaf-soft", "bg-flame-soft", "bg-accent-soft"][i % 4]
                  }`}
                >
                  {s.emoji}
                </span>
                <span className="mt-5 text-lg font-black">{s.label}</span>
                <span className="mt-1 text-sm font-medium text-muted">{s.description}</span>
                <span className="mt-4 rounded-full bg-sun px-3 py-1 text-xs font-black text-sun-ink opacity-0 transition group-hover:opacity-100">
                  開始對話 ▶
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <ChatRoom
      chat={chat}
      emoji={scenario.emoji}
      title={scenario.label}
      subtitle={scenario.description}
      onBack={backToScenarios}
      backLabel="換場景"
    />
  );
}
