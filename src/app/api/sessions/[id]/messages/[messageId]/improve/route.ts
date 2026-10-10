import { requireUser } from "@/lib/auth";
import { findUserMessage } from "@/lib/feedback";
import { chatJSON } from "@/lib/claude";
import { FeedbackModel } from "@/models/Feedback";

type ImproveResult = {
  improved?: string;
  explanation?: string;
};

const SYSTEM_PROMPT = `You are an English speaking coach helping a Taiwanese learner.
Given the conversation and the learner's reply, write a better, more complete and natural reply that a fluent speaker would say in this situation.
Keep the learner's original meaning and intent, fix any mistakes, and add a little useful detail so the answer sounds complete. Keep it to 1-3 sentences.
- "improved": the better reply in English.
- "explanation": briefly explain in Traditional Chinese (繁體中文) why this version is better and which expressions are worth learning.`;

// 讓 Claude 一定照這個格式回傳 JSON
const SCHEMA = {
  type: "object",
  properties: {
    improved: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["improved", "explanation"],
  additionalProperties: false,
};

// 給某一則使用者訊息一個更好、更完整的回答
export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/sessions/[id]/messages/[messageId]/improve">,
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id, messageId } = await ctx.params;
  const found = await findUserMessage(user.id, id, messageId);
  if (found.error) return found.error;
  const { session, message, scenarioLabel, context } = found;

  let result: ImproveResult;
  try {
    result = await chatJSON<ImproveResult>(
      SYSTEM_PROMPT,
      `Scenario: ${scenarioLabel}\nConversation so far:\n${context}\n\nLearner's reply:\n${message.content}`,
      SCHEMA,
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 暫時無法回應，請稍後再試" }, { status: 502 });
  }

  if (!result.improved) {
    return Response.json({ error: "AI 沒有給出建議，請再試一次" }, { status: 502 });
  }

  const doc = await FeedbackModel.create({
    user: user.id,
    session: session._id,
    messageId: message._id,
    type: "suggestion",
    category: "expression",
    original: message.content,
    corrected: result.improved,
    explanation: result.explanation ?? "",
  });

  return Response.json({
    id: doc._id.toString(),
    original: doc.original,
    improved: doc.corrected,
    explanation: doc.explanation,
  });
}
