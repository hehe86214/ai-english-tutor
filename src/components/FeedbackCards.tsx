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

export function GrammarCard({
  corrected,
  issues,
}: {
  corrected?: string;
  issues: GrammarIssue[];
}) {
  return (
    <div className="animate-rise w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <div className="flex items-center gap-2 border-b border-line bg-amber-soft/60 px-4 py-2.5">
        <span className="size-1.5 rounded-full bg-amber" />
        <span className="text-xs font-semibold tracking-wide text-amber">文法糾正</span>
      </div>
      <div className="space-y-3 px-4 py-3.5 text-sm">
        {issues.length === 0 ? (
          <p className="text-muted">這句沒有文法問題，說得很好。</p>
        ) : (
          <>
            {corrected && (
              <p className="text-[15px] leading-relaxed text-ink">{corrected}</p>
            )}
            <ul className="space-y-3">
              {issues.map((issue) => (
                <li key={issue.id} className="rounded-xl bg-sunken/70 px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] text-muted ring-1 ring-line">
                      {CATEGORY_LABELS[issue.category] ?? issue.category}
                    </span>
                    <span className="text-rose line-through decoration-rose/50">{issue.original}</span>
                    <span className="text-faint">→</span>
                    <span className="font-medium text-accent">{issue.corrected}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{issue.explanation}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
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
    <div className="animate-rise w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <div className="flex items-center gap-2 border-b border-line bg-accent-soft/70 px-4 py-2.5">
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="text-xs font-semibold tracking-wide text-accent">更好的說法</span>
      </div>
      <div className="px-4 py-3.5">
        <p className="font-display text-[19px] leading-snug text-ink">“{improved}”</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{explanation}</p>
      </div>
    </div>
  );
}
