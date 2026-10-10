import Link from "next/link";
import Brand from "@/components/Brand";
import { GrammarCard, SuggestionCard } from "@/components/FeedbackCards";
import { SCENARIOS } from "@/lib/scenarios";

const STEPS = [
  {
    title: "選一個場景",
    body: "點餐、面試、機場、開會……AI 會扮演對應的角色，先開口問你第一句。",
  },
  {
    title: "用英文回答",
    body: "像真的在對話一樣打字回覆。說錯沒關係，對方只會自然地把話題接下去。",
  },
  {
    title: "看怎麼說更好",
    body: "任何一句都能請 AI 糾正文法，或給你一個更完整、更道地的說法。",
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <SiteNav />
      <Hero />
      <Scenarios />
      <HowItWorks />
      <Features />
      <FinalCta />
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Brand />
          <p>© 2026 AI 英文家教 · 讓每一句英文都說得更好</p>
        </div>
      </footer>
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Brand />
        <div className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#scenarios" className="transition hover:text-ink">場景</a>
          <a href="#how" className="transition hover:text-ink">怎麼練</a>
          <a href="#features" className="transition hover:text-ink">功能</a>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <Link href="/login" className="rounded-full px-4 py-2 text-muted transition hover:text-ink">
            登入
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition hover:opacity-85"
          >
            免費註冊
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[36rem] max-w-5xl rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            你的 AI 英文口說陪練
          </p>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[1.05] tracking-tight sm:text-7xl">
            把英文，
            <br />
            <span className="italic text-accent">說出口。</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            選一個生活場景，AI 扮演店員、面試官、同事或朋友跟你對話。每一句都能請它糾正文法、給你更自然的說法——不怕說錯，越說越好。
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_10px_30px_-10px_var(--accent)] transition hover:bg-accent-hover"
            >
              免費開始練習
              <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/login"
              className="rounded-full px-5 py-3.5 text-muted transition hover:text-ink"
            >
              已經有帳號？登入
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["8", "種生活場景"],
              ["即時", "文法糾正"],
              ["永久", "保存紀錄"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl">{value}</dt>
                <dd className="mt-1 text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroDemo />
      </div>
    </section>
  );
}

// 首頁的示意畫面：用真的卡片元件排出一段範例對話
function HeroDemo() {
  return (
    <div className="relative animate-rise [animation-delay:120ms]">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/15 via-transparent to-amber/15 blur-2xl" />
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]">
        <div className="flex items-center gap-3 border-b border-line bg-surface px-5 py-3.5">
          <span className="grid size-9 place-items-center rounded-full bg-sunken text-lg">☕</span>
          <div>
            <p className="text-sm font-semibold">點餐</p>
            <p className="text-xs text-muted">在餐廳或咖啡廳點餐</p>
          </div>
          <div className="ml-auto flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-end gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken text-sm">☕</span>
            <div className="max-w-[80%] rounded-3xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed">
              Hi there! What can I get for you today?
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="max-w-[80%] rounded-3xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-ink">
              I wants a coffee and one cake, please.
            </div>
          </div>
          <div className="ml-auto max-w-[88%]">
            <GrammarCard
              corrected="I want a coffee and a piece of cake, please."
              issues={[
                {
                  id: "1",
                  category: "grammar",
                  original: "wants",
                  corrected: "want",
                  explanation: "主詞是 I，動詞用原形 want，不加 s。",
                },
              ]}
            />
          </div>
          <div className="ml-auto max-w-[88%]">
            <SuggestionCard
              improved="Could I get a coffee and a slice of cake?"
              explanation="用 Could I get… 點餐更自然有禮貌。"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>}
    </div>
  );
}

function Scenarios() {
  return (
    <section id="scenarios" className="scroll-mt-16 border-t border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Scenes"
          title={
            <>
              生活裡會遇到的，<span className="italic">都能練</span>
            </>
          }
          body="每個場景都有專屬的 AI 角色：咖啡廳店員、面試官、地勤人員、同事、朋友，甚至是你的另一半。"
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCENARIOS.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-accent/30"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-surface text-2xl ring-1 ring-line">
                {s.emoji}
              </span>
              <p className="mt-4 font-semibold">{s.label}</p>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              三個步驟，<span className="italic">開口不再卡</span>
            </>
          }
        />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative border-t border-ink/80 pt-6">
              <span className="font-display text-6xl leading-none text-accent/80 italic">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              不只聊天，<span className="italic">每句都在進步</span>
            </>
          }
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <FeatureCard
            dot="bg-amber"
            title="糾正文法"
            body="找出時態、單複數、用字和拼字的錯誤，逐一用中文解釋為什麼要這樣改。"
          >
            <p className="text-sm">
              <span className="text-rose line-through decoration-rose/50">She don&apos;t like</span>
              <span className="mx-2 text-faint">→</span>
              <span className="font-medium text-accent">She doesn&apos;t like</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">第三人稱單數要用 doesn&apos;t。</p>
          </FeatureCard>
          <FeatureCard
            dot="bg-accent"
            title="更好的完整回答"
            body="保留你想表達的意思，換成母語人士在這個情境會說的完整說法。"
          >
            <p className="text-xs text-muted">你說：It is good.</p>
            <p className="mt-1.5 font-display text-lg leading-snug">
              “It went really well — I learned a lot from it.”
            </p>
          </FeatureCard>
          <FeatureCard
            dot="bg-ink"
            title="練習紀錄"
            body="每一場對話和每一筆糾正都會存下來，隨時回來複習自己常犯的錯。"
          >
            <div className="space-y-2">
              {[
                ["💼", "面試", "6 則對話 · 3 筆糾正"],
                ["✈️", "機場", "8 則對話 · 2 筆糾正"],
              ].map(([emoji, label, meta]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2 ring-1 ring-line">
                  <span>{emoji}</span>
                  <span className="text-sm font-medium">{label}</span>
                  <span className="ml-auto text-xs text-muted">{meta}</span>
                </div>
              ))}
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  dot,
  title,
  body,
  children,
}: {
  dot: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-line bg-paper p-6">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${dot}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-3 leading-relaxed text-muted">{body}</p>
      <div className="mt-6 rounded-2xl bg-sunken/70 p-4">{children}</div>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-accent px-6 py-16 text-center text-accent-ink sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-accent-ink/10 blur-3xl"
        />
        <h2 className="relative font-display text-4xl leading-tight sm:text-6xl">
          今天就開始
          <br />
          <span className="italic">你的第一場對話</span>
        </h2>
        <p className="relative mx-auto mt-5 max-w-md text-accent-ink/75">
          免費註冊，選一個場景，三十秒後你就在用英文聊天了。
        </p>
        <Link
          href="/signup"
          className="group relative mt-9 inline-flex items-center gap-2 rounded-full bg-accent-ink px-7 py-3.5 font-medium text-accent transition hover:opacity-90"
        >
          免費註冊
          <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </section>
  );
}
