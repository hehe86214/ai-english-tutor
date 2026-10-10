import Link from "next/link";

export default function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-ink shadow-sm transition group-hover:rotate-[-6deg]">
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden>
          <path
            d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h0a2 2 0 0 1-2-2V6.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9 9.5h6M9 12h3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="hidden text-[15px] font-semibold tracking-tight min-[420px]:inline">AI 英文家教</span>
    </Link>
  );
}
