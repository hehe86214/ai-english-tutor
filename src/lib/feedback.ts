import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { resolvePracticeMode } from "@/lib/practice-mode";
import { PracticeSessionModel } from "@/models/PracticeSession";

// 前後文最多帶幾則訊息給 OpenAI 參考
const CONTEXT_SIZE = 6;

// 找出要糾錯的那則使用者訊息，以及它之前的對話（給 AI 當前後文）
export async function findUserMessage(
  userId: string,
  sessionId: string,
  messageId: string,
) {
  if (!isValidObjectId(sessionId) || !isValidObjectId(messageId)) {
    return { error: Response.json({ error: "找不到這則訊息" }, { status: 404 }) };
  }

  await connectDB();
  // 查詢條件帶上 user，別人的練習一律當作不存在
  const session = await PracticeSessionModel.findOne({
    _id: sessionId,
    user: userId,
  });
  const index =
    session?.messages.findIndex((m) => m._id.toString() === messageId) ?? -1;
  if (!session || index === -1) {
    return { error: Response.json({ error: "找不到這則訊息" }, { status: 404 }) };
  }

  const message = session.messages[index];
  if (message.role !== "user") {
    return {
      error: Response.json({ error: "只能糾正你自己說的話" }, { status: 400 }),
    };
  }

  const context = session.messages
    .slice(Math.max(0, index - CONTEXT_SIZE), index)
    .map((m) => `${m.role === "user" ? "Learner" : "Partner"}: ${m.content}`)
    .join("\n");

  return {
    session,
    message,
    scenarioLabel: resolvePracticeMode(session)?.label ?? session.scenario,
    context,
  };
}
