import Anthropic from "@anthropic-ai/sdk";

const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

type Effort = "low" | "medium" | "high";

let client: Anthropic | null = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("請在 .env.local 設定 ANTHROPIC_API_KEY");
  }
  // 預設會讀 process.env.ANTHROPIC_API_KEY
  client ??= new Anthropic();
  return client;
}

async function createMessage(params: {
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  effort: Effort;
  schema?: Record<string, unknown>;
}) {
  const response = await getClient().beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    system: params.system,
    messages: params.messages,
    output_config: {
      effort: params.effort,
      ...(params.schema && {
        format: { type: "json_schema", schema: params.schema },
      }),
    },
    // 如果請求被安全機制拒絕，由伺服器自動改用建議的備援模型重試
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") {
    throw new Error(
      `Claude 拒絕回應: ${response.stop_details?.explanation ?? "unknown"}`,
    );
  }

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  if (!text) {
    throw new Error(`Claude 沒有回傳內容 (stop_reason: ${response.stop_reason})`);
  }
  return text;
}

// 角色扮演對話：回傳 AI 的下一句話
export function chat(system: string, messages: Anthropic.Beta.BetaMessageParam[]) {
  // 一般對話用 low effort，回得比較快
  return createMessage({ system, messages, effort: "low" });
}

// 要求 Claude 依照 JSON schema 回傳並解析
export async function chatJSON<T>(
  system: string,
  userContent: string,
  schema: Record<string, unknown>,
) {
  const text = await createMessage({
    system,
    messages: [{ role: "user", content: userContent }],
    effort: "medium",
    schema,
  });
  return JSON.parse(text) as T;
}

// 對話的第一則一定要是 user，用這句請 AI 開場
export const OPENING_PROMPT =
  "Start the conversation in character with a short greeting and one question for me.";

export function buildSystemPrompt(persona: string) {
  return [
    persona,
    "You are role-playing to help the user practice speaking English.",
    "Rules:",
    "- Always reply in English and stay in character.",
    "- Keep each reply short: 1 to 3 sentences, like a real conversation.",
    "- Use clear, natural English suitable for an intermediate learner.",
    "- End most replies with a question so the user has something to answer.",
    "- Do not correct the user's mistakes; just keep the conversation going.",
  ].join("\n");
}
