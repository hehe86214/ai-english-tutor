import { requireUser } from "@/lib/auth";
import { findUserMessage } from "@/lib/feedback";
import { chatJSON } from "@/lib/ai";
import { FeedbackModel } from "@/models/Feedback";

const CATEGORIES = ["grammar", "vocabulary", "spelling", "expression", "other"];

type GrammarResult = {
  corrected?: string;
  issues?: {
    category?: string;
    original?: string;
    corrected?: string;
    explanation?: string;
  }[];
};

const SYSTEM_PROMPT = `You are an English teacher helping a Taiwanese learner.
Check the learner's sentence for grammar, spelling and word-choice mistakes.
Only fix real mistakes. Keep the learner's meaning and style; do not rewrite sentences that are already correct.
- "corrected": the full corrected sentence (same as the original if there are no mistakes).
- "issues": one item per mistake. "original" is the wrong part copied from the learner's sentence, "corrected" is the fixed part, and "explanation" briefly explains why in Traditional Chinese (繁體中文).
If there are no mistakes, return an empty "issues" array.`;

// 讓 AI 一定照這個格式回傳 JSON
const SCHEMA = {
  type: "object",
  properties: {
    corrected: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", enum: CATEGORIES },
          original: { type: "string" },
          corrected: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["category", "original", "corrected", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["corrected", "issues"],
  additionalProperties: false,
};

// 糾正某一則使用者訊息的文法
export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/sessions/[id]/messages/[messageId]/grammar">,
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id, messageId } = await ctx.params;
  const found = await findUserMessage(user.id, id, messageId);
  if (found.error) return found.error;
  const { session, message, scenarioLabel, context } = found;

  let result: GrammarResult;
  try {
    result = await chatJSON<GrammarResult>(
      SYSTEM_PROMPT,
      `Scenario: ${scenarioLabel}\nConversation so far:\n${context}\n\nLearner's sentence to check:\n${message.content}`,
      SCHEMA,
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 暫時無法回應，請稍後再試" }, { status: 502 });
  }

  const issues = (result.issues ?? []).filter((i) => i.original && i.corrected);

  // 每個錯誤存成一筆 Feedback
  const docs = await FeedbackModel.insertMany(
    issues.map((i) => ({
      user: user.id,
      session: session._id,
      messageId: message._id,
      type: "correction",
      category: CATEGORIES.includes(i.category ?? "") ? i.category : "other",
      original: i.original,
      corrected: i.corrected,
      explanation: i.explanation ?? "",
    })),
  );

  return Response.json({
    original: message.content,
    corrected: result.corrected || message.content,
    hasErrors: docs.length > 0,
    issues: docs.map((d) => ({
      id: d._id.toString(),
      category: d.category,
      original: d.original,
      corrected: d.corrected,
      explanation: d.explanation,
    })),
  });
}
