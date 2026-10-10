"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    // refresh 會清掉 router 快取，畫面上不留上一個使用者的資料
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded-full border-2 border-line px-3.5 py-1.5 font-bold text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
    >
      登出
    </button>
  );
}
