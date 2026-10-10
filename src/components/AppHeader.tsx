import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";
import Brand from "./Brand";
import LogoutButton from "./LogoutButton";

export default function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4 sm:px-6">
        <Brand href="/practice" />
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/practice"
            className="rounded-lg px-3 py-1.5 text-muted transition hover:bg-sunken hover:text-ink"
          >
            練習
          </Link>
          <Link
            href="/history"
            className="rounded-lg px-3 py-1.5 text-muted transition hover:bg-sunken hover:text-ink"
          >
            紀錄
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden items-center gap-2 text-muted sm:flex">
            <span className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
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
