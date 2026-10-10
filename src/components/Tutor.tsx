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
                onClick={() => choose(s)}
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
