// AI 服務：OpenAI Chat Completions API，金鑰讀 OPENAI_API_KEY

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Effort = "low" | "medium" | "high";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

async function createCompletion(params: {
  system: string;
  messages: ChatMessage[];
  effort: Effort;
  schema?: Record<string, unknown>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("請在 .env.local 設定 OPENAI_API_KEY");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      reasoning_effort: params.effort,
      messages: [{ role: "system", content: params.system }, ...params.messages],
      // 要求一定照 JSON schema 回傳
      ...(params.schema && {
        response_format: {
          type: "json_schema",
          json_schema: { name: "result", strict: true, schema: params.schema },
        },
      }),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenAI API 錯誤 (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;
  if (message?.refusal) {
    throw new Error(`OpenAI 拒絕回應: ${message.refusal}`);
  }
  const content: string | undefined = message?.content?.trim();
  if (!content) {
    throw new Error(`OpenAI 沒有回傳內容 (finish_reason: ${data.choices?.[0]?.finish_reason})`);
  }
  return content;
}

// 角色扮演對話：回傳 AI 的下一句話
export function chat(system: string, messages: ChatMessage[]) {
  // 一般對話用 low effort，回得比較快
  return createCompletion({ system, messages, effort: "low" });
}

// 要求 AI 依照 JSON schema 回傳並解析
export async function chatJSON<T>(
  system: string,
  userContent: string,
  schema: Record<string, unknown>,
) {
  const text = await createCompletion({
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
    "- Write plain text only. Do not use Markdown (no **bold**, headings, or bullet lists).",
  ].join("\n");
}
