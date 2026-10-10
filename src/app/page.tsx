import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";
import { GrammarCard, SuggestionCard } from "@/components/FeedbackCards";
import PhotoCard from "@/components/ui/PhotoCard";
import { COURSE_IMAGES, LEVEL_PILL } from "@/components/ui/level";
import { COURSES, LESSONS, LEVELS, type Level } from "@/content/lessons";
import { SCENARIOS } from "@/lib/scenarios";

const STEPS = [
  {
    emoji: "📚",
    title: "選一堂課",
    body: "依程度挑選教材，先預習單字、句型和範例對話，每一句都能聽發音。",
  },
  {
    emoji: "🎙️",
    title: "跟 AI 老師上課",
    body: "老師照上課流程一步步帶你練，可以打字，也可以直接用麥克風說英文。",
  },
  {
    emoji: "🚀",
    title: "看怎麼說更好",
    body: "任何一句都能請老師糾正文法，或給你更完整、更道地的說法。",
  },
];

// 每個課程的等級（例如 A1、B1）
function courseLevel(courseId: string): Level {
  return LESSONS.find((l) => l.courseId === courseId)!.level;
}

function levelLabel(level: Level) {
  return `${level} ${LEVELS.find((l) => l.id === level)?.label ?? ""}`;
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <SiteNav />
      <Hero />
      <Curriculum />
      <HowItWorks />
      <Features />
      <Scenarios />
      <FinalCta />
      <footer className="bg-accent text-accent-ink dark:bg-surface dark:text-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
          <span className="font-display text-lg font-black">AI 英文家教</span>
          <p className="opacity-75">© 2026 AI 英文家教 · 讓每一句英文都說得更好</p>
        </div>
      </footer>
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Brand />
        <div className="hidden items-center gap-1 text-[15px] font-bold lg:flex">
          {[
            ["#curriculum", "系統課綱"],
            ["#how", "上課方式"],
            ["#features", "學習功能"],
            ["#scenarios", "情境對話"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-sun-soft">
              {label}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 text-[15px] font-bold transition hover:bg-sunken"
          >
            登入
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-sun px-5 py-2.5 text-[15px] font-black text-sun-ink shadow-[0_8px_20px_-8px_var(--flame)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_var(--flame)]"
          >
            免費註冊
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HighlightStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <span aria-hidden className="absolute -top-3 -left-3 text-2xl font-black text-flame">
        +
      </span>
      <p className="bg-sunrise px-3.5 py-2 font-display text-[17px] font-black text-white shadow-[0_10px_30px_-12px_var(--flame)] min-[400px]:text-lg sm:px-5 sm:text-3xl">
        {children}
      </p>
    </div>
  );
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 rounded-full bg-sunrise px-8 py-4 text-lg font-black text-white shadow-[0_14px_34px_-12px_var(--flame)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_var(--flame)]"
    >
      {children}
      <span className="transition group-hover:translate-x-1">→</span>
    </Link>
  );
}

function Hero() {
  return (
    <section className="bg-dots">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-accent shadow-sm ring-1 ring-line">
            <span className="size-2 rounded-full bg-leaf" />
            24 小時隨時開課 · AI 老師一對一
          </span>
          <h1 className="mt-6 font-display text-[3.2rem] leading-[1.08] font-black tracking-tight text-accent sm:text-7xl dark:text-ink">
            隨時開口的
            <br />
            AI 英文教室
          </h1>
          <div className="mt-6">
            <HighlightStrip>{LESSONS.length} 堂系統課程，把真實生活帶入課堂</HighlightStrip>
          </div>
          <p className="mt-7 max-w-lg text-lg leading-relaxed font-medium text-muted">
            依 CEFR 等級編排的教材，加上會糾正你、教你更好說法的 AI 老師。不用約時間、不怕說錯，每天都能練。
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CtaButton href="/signup">免費開始上課</CtaButton>
            <Link
              href="/login"
              className="rounded-full border-2 border-accent/20 bg-surface px-6 py-[14px] text-lg font-bold text-accent transition hover:border-accent dark:text-ink"
            >
              我已經有帳號
            </Link>
          </div>
          <dl className="mt-11 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [String(LESSONS.length), "堂原創課程"],
              ["4", "個 CEFR 等級"],
              [String(SCENARIOS.length), "種情境對話"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl font-black text-accent dark:text-ink">{value}</dt>
                <dd className="mt-0.5 text-sm font-bold text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative animate-rise [animation-delay:120ms]">
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-[32px] border-[6px] border-sun shadow-[0_30px_70px_-30px_rgb(30_31_85/0.6)]">
        <Image
          src="/images/hero.jpg"
          alt="戴耳機用筆電上英文課的學生"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14134a]/55 via-transparent to-transparent" />
      </div>

      <div className="absolute -top-5 -left-3 max-w-[16rem] rounded-3xl rounded-bl-md bg-surface px-4 py-3 text-sm font-semibold shadow-[0_16px_40px_-16px_rgb(30_31_85/0.5)] sm:-left-8">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-black text-accent dark:text-sun">
          <span className="grid size-5 place-items-center rounded-full bg-sun text-[11px]">✈️</span>
          AI 老師 · 機場報到
        </p>
        Where are you flying today, and may I see your passport?
      </div>

      <div className="absolute right-3 -bottom-8 w-[19rem] sm:-right-6">
        <GrammarCard
          corrected="I'm flying to Tokyo."
          issues={[
            {
              id: "1",
              category: "grammar",
              original: "I am fly",
              corrected: "I'm flying",
              explanation: "即將發生的行程用現在進行式 be + V-ing。",
            },
          ]}
        />
      </div>

      <span className="absolute -bottom-6 left-6 rounded-full bg-leaf px-4 py-2 text-sm font-black text-white shadow-lg">
        Level A1 → B2 ▶
      </span>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  strip,
  body,
}: {
  eyebrow?: string;
  title: string;
  strip?: string;
  body?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <p className="text-sm font-black tracking-[0.2em] text-flame uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-4xl leading-tight font-black text-accent sm:text-6xl dark:text-ink">
        {title}
      </h2>
      {strip && (
        <div className="mt-5">
          <HighlightStrip>{strip}</HighlightStrip>
        </div>
      )}
      {body && <p className="mt-5 max-w-2xl text-lg font-medium text-muted">{body}</p>}
    </div>
  );
}

function Curriculum() {
  const course = (id: string) => {
    const c = COURSES.find((x) => x.id === id)!;
    const level = courseLevel(id);
    const count = LESSONS.filter((l) => l.courseId === id).length;
    return {
      href: "/signup",
      image: COURSE_IMAGES[id],
      title: c.title,
      subtitle: `${c.titleEn} · ${count} 堂課`,
      pill: `Level ${levelLabel(level)}`,
      pillClass: LEVEL_PILL[level],
    };
  };

  return (
    <section id="curriculum" className="scroll-mt-16 bg-dots border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionTitle
          title="AI 英文家教系統課綱"
          strip="從入門到進階，每堂課都有明確目標"
        />

        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:gap-5 lg:auto-rows-[220px] lg:grid-cols-4">
          <PhotoCard {...course("daily")} size="lg" priority className="col-span-2 row-span-2" />
          <PhotoCard {...course("travel")} />
          <PhotoCard {...course("dining")} />
          <PhotoCard {...course("discussion")} size="lg" className="col-span-2 row-span-2" />
          <PhotoCard {...course("business")} />
          <PhotoCard {...course("interview")} />
        </div>

        <div className="mt-12 flex justify-center">
          <CtaButton href="/signup">免費開始第一堂課</CtaButton>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionTitle eyebrow="How it works" title="三個步驟，開口不再卡" />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-[28px] border-2 border-line bg-paper p-7 transition hover:border-sun"
            >
              <span className="absolute -top-5 left-7 grid size-11 place-items-center rounded-full bg-sun font-display text-xl font-black text-sun-ink shadow-[0_8px_18px_-8px_var(--flame)]">
                {i + 1}
              </span>
              <span className="text-4xl">{step.emoji}</span>
              <h3 className="mt-4 font-display text-2xl font-black text-accent dark:text-ink">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed font-medium text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-dots border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionTitle
            eyebrow="Features"
            title="不只聊天，每句都在進步"
            body="每一句你說的英文，都可以一鍵請 AI 老師幫你檢查。"
          />
          <ul className="mt-10 space-y-4">
            {[
              ["✏️", "bg-amber", "糾正文法", "找出時態、單複數、用字和拼字錯誤，逐一用中文解釋。"],
              ["✨", "bg-leaf", "更好的完整回答", "保留你的意思，換成母語人士在這個情境會說的說法。"],
              ["🎙️", "bg-flame", "語音輸入與朗讀", "直接用麥克風說英文；單字、句型、對話都能聽發音。"],
              ["📈", "bg-accent", "學習紀錄與進度", "每堂課、每一筆糾正都會保存，隨時回來複習。"],
            ].map(([icon, bg, title, body]) => (
              <li
                key={title}
                className="flex gap-4 rounded-3xl border-2 border-line bg-surface p-5 transition hover:border-sun"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-xl ${bg}`}>
                  {icon}
                </span>
                <div>
                  <p className="text-lg font-black">{title}</p>
                  <p className="mt-0.5 font-medium text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-[32px] border-[5px] border-sun bg-surface p-5 shadow-[0_30px_70px_-30px_rgb(30_31_85/0.5)] sm:p-7">
          <div className="flex items-center gap-3 border-b-2 border-line pb-4">
            <span className="grid size-11 place-items-center rounded-full bg-sun-soft text-xl">💼</span>
            <div>
              <p className="font-black">介紹你自己 · Tell Me About Yourself</p>
              <p className="text-xs font-bold text-muted">面試英文 Lesson 1 · B1</p>
            </div>
          </div>
          <div className="space-y-3 pt-5">
            <div className="w-fit max-w-[85%] rounded-3xl rounded-bl-md bg-sunken px-4 py-3 text-[15px] font-semibold">
              Can you tell me a little about yourself?
            </div>
            <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-md bg-accent px-4 py-3 text-[15px] font-semibold text-accent-ink">
              I am work as engineer for three years.
            </div>
            <div className="ml-auto max-w-[92%] space-y-3">
              <GrammarCard
                corrected="I have worked as an engineer for three years."
                issues={[
                  {
                    id: "a",
                    category: "grammar",
                    original: "I am work",
                    corrected: "I have worked",
                    explanation: "持續到現在的經驗，用現在完成式。",
                  },
                ]}
              />
              <SuggestionCard
                improved="I've been working as a software engineer for the past three years."
                explanation="用現在完成進行式強調持續到現在，並補上職稱。"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Scenarios() {
  return (
    <section id="scenarios" className="scroll-mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionTitle
          eyebrow="Free talk"
          title="還想多練？自由情境對話"
          body="AI 扮演店員、面試官、同事、朋友甚至另一半，想聊什麼就聊什麼。"
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-3xl border-2 border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-sun"
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl ${
                  ["bg-sun-soft", "bg-leaf-soft", "bg-flame-soft", "bg-accent-soft"][i % 4]
                }`}
              >
                {s.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-black">{s.label}</p>
                <p className="truncate text-sm font-medium text-muted">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-dots px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border-[6px] border-sun bg-accent px-6 py-16 text-center text-accent-ink sm:px-12 sm:py-20 dark:bg-surface dark:text-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-sun/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-flame/25 blur-3xl"
        />
        <p className="relative text-sm font-black tracking-[0.2em] text-sun uppercase">Start today</p>
        <h2 className="relative mt-3 font-display text-4xl leading-tight font-black sm:text-6xl">
          今天就開始你的第一堂課
        </h2>
        <p className="relative mx-auto mt-5 max-w-md text-lg font-medium opacity-80">
          免費註冊，選一堂課，三十秒後你就在用英文跟老師對話了。
        </p>
        <div className="relative mt-10 flex justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-sun px-9 py-4 text-lg font-black text-sun-ink shadow-[0_14px_34px_-10px_var(--sun)] transition hover:-translate-y-0.5"
          >
            免費註冊
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
