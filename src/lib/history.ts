import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getScenario } from "@/lib/scenarios";
import { FeedbackModel } from "@/models/Feedback";
import { PracticeSessionModel } from "@/models/PracticeSession";

// 這裡的 userId 一律來自 getCurrentUser()，不能接受前端傳來的值

export type SessionSummary = {
  id: string;
  scenarioLabel: string;
  emoji: string;
  messageCount: number;
  feedbackCount: number;
  createdAt: Date;
};

export async function listMySessions(userId: string): Promise<SessionSummary[]> {
  await connectDB();
  const sessions = await PracticeSessionModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  const counts = await FeedbackModel.aggregate<{ _id: unknown; count: number }>([
    // aggregate 不會自動轉型，要自己把字串轉成 ObjectId
    { $match: { user: new Types.ObjectId(userId) } },
    { $group: { _id: "$session", count: { $sum: 1 } } },
  ]);
  const countBySession = new Map(counts.map((c) => [String(c._id), c.count]));

  return sessions.map((s) => {
    const scenario = getScenario(s.scenario);
    return {
      id: s._id.toString(),
      scenarioLabel: scenario?.label ?? s.scenario,
      emoji: scenario?.emoji ?? "💬",
      messageCount: s.messages.length,
      feedbackCount: countBySession.get(s._id.toString()) ?? 0,
      createdAt: s.createdAt,
    };
  });
}

export type FeedbackItem = {
  id: string;
  type: "correction" | "suggestion";
  category: string;
  original: string;
  corrected: string;
  explanation: string;
};

export type SessionDetail = {
  id: string;
  scenarioLabel: string;
  emoji: string;
  createdAt: Date;
  messages: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    feedback: FeedbackItem[];
  }[];
};

// 找不到或不是自己的練習都回傳 null
export async function getMySession(
  userId: string,
  sessionId: string,
): Promise<SessionDetail | null> {
  if (!isValidObjectId(sessionId)) return null;

  await connectDB();
  const session = await PracticeSessionModel.findOne({
    _id: sessionId,
    user: userId,
  }).lean();
  if (!session) return null;

  const feedback = await FeedbackModel.find({
    session: session._id,
    user: userId,
  })
    .sort({ createdAt: 1 })
    .lean();

  const feedbackByMessage = new Map<string, FeedbackItem[]>();
  for (const f of feedback) {
    const key = f.messageId.toString();
    const list = feedbackByMessage.get(key) ?? [];
    list.push({
      id: f._id.toString(),
      type: f.type,
      category: f.category,
      original: f.original,
      corrected: f.corrected,
      explanation: f.explanation,
    });
    feedbackByMessage.set(key, list);
  }

  const scenario = getScenario(session.scenario);
  return {
    id: session._id.toString(),
    scenarioLabel: scenario?.label ?? session.scenario,
    emoji: scenario?.emoji ?? "💬",
    createdAt: session.createdAt,
    messages: session.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        id: m._id.toString(),
        role: m.role,
        content: m.content,
        feedback: feedbackByMessage.get(m._id.toString()) ?? [],
      })),
  };
}
