import Link from "next/link";

export default function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span className="relative grid size-10 place-items-center rounded-2xl bg-sun shadow-[0_6px_16px_-6px_var(--flame)] transition group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" fill="none" className="size-5 text-accent dark:text-sun-ink" aria-hidden>
          <path
            d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15a2 2 0 0 1-2-2V6.5Z"
            fill="currentColor"
          />
          <path d="M9 9.5h6M9 12h3.5" stroke="var(--sun)" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-flame text-[10px] font-black text-white">
          +
        </span>
      </span>
      <span className="hidden flex-col leading-none min-[420px]:flex">
        <span className="font-display text-[17px] font-black tracking-tight text-accent dark:text-ink">
          AI 英文家教
        </span>
        <span className="mt-1 text-[10px] font-bold tracking-[0.18em] text-muted uppercase">
          English Tutor
        </span>
      </span>
    </Link>
  );
}
