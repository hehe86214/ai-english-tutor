import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";
import Brand from "./Brand";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/lessons", label: "教材" },
  { href: "/practice", label: "情境對話" },
  { href: "/history", label: "紀錄" },
];

export default function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:gap-8 sm:px-6">
        <Brand href="/lessons" />
        <div className="flex items-center gap-0.5 text-[15px] font-bold sm:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-ink/80 transition hover:bg-sun-soft hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden items-center gap-2 font-bold sm:flex">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-black text-accent-ink ring-4 ring-accent-soft">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-32 truncate">{user.name}</span>
          </span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
