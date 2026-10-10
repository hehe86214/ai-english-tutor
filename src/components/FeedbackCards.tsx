// 文法糾正、更好說法的卡片：練習畫面和練習紀錄共用

export type GrammarIssue = {
  id: string;
  category: string;
  original: string;
  corrected: string;
  explanation: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  grammar: "文法",
  vocabulary: "用字",
  spelling: "拼字",
  expression: "表達",
  other: "其他",
};

function CardShell({
  tone,
  icon,
  title,
  children,
}: {
  tone: "amber" | "leaf";
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  const head =
    tone === "amber" ? "bg-amber-soft text-amber border-amber/25" : "bg-leaf-soft text-leaf border-leaf/25";
  return (
    <div
      className={`animate-rise w-full overflow-hidden rounded-3xl border-2 bg-surface shadow-[0_12px_30px_-18px_rgb(30_31_85/0.35)] ${
        tone === "amber" ? "border-amber/30" : "border-leaf/30"
      }`}
    >
      <div className={`flex items-center gap-2 border-b-2 px-4 py-2.5 ${head}`}>
        <span className="text-base leading-none">{icon}</span>
        <span className="text-[13px] font-black tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function GrammarCard({
  corrected,
  issues,
}: {
  corrected?: string;
  issues: GrammarIssue[];
}) {
  return (
    <CardShell tone="amber" icon="✏️" title="文法糾正">
      <div className="space-y-3 px-4 py-3.5 text-sm">
        {issues.length === 0 ? (
          <p className="font-bold text-leaf">👍 這句沒有文法問題，說得很好！</p>
        ) : (
          <>
            {corrected && (
              <p className="text-[15px] leading-relaxed font-bold text-ink">{corrected}</p>
            )}
            <ul className="space-y-2.5">
              {issues.map((issue) => (
                <li key={issue.id} className="rounded-2xl bg-sunken px-3.5 py-2.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-black text-white">
                      {CATEGORY_LABELS[issue.category] ?? issue.category}
                    </span>
                    <span className="font-semibold text-rose line-through decoration-2 decoration-rose/50">
                      {issue.original}
                    </span>
                    <span className="font-black text-faint">→</span>
                    <span className="font-black text-leaf">{issue.corrected}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{issue.explanation}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </CardShell>
  );
}

export function SuggestionCard({
  improved,
  explanation,
}: {
  improved: string;
  explanation: string;
}) {
  return (
    <CardShell tone="leaf" icon="✨" title="更好的說法">
      <div className="px-4 py-3.5">
        <p className="text-[17px] leading-snug font-black text-ink">“{improved}”</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{explanation}</p>
      </div>
    </CardShell>
  );
}
