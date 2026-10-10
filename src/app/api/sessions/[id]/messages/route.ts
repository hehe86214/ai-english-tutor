import { isValidObjectId } from "mongoose";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { chat } from "@/lib/ai";
import { resolvePracticeMode } from "@/lib/practice-mode";
import { PracticeSessionModel } from "@/models/PracticeSession";

const MAX_LENGTH = 1000;

// 使用者送出一句英文，AI 用該場景的人設回應
export async function POST(
  request: Request,
  ctx: RouteContext<"/api/sessions/[id]/messages">,
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await ctx.params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "找不到這場練習" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) {
    return Response.json({ error: "請輸入內容" }, { status: 400 });
  }
  if (content.length > MAX_LENGTH) {
    return Response.json(
      { error: `一次最多 ${MAX_LENGTH} 個字元` },
      { status: 400 },
    );
  }

  await connectDB();
  // 查詢條件帶上 user，別人的練習一律當作不存在
  const session = await PracticeSessionModel.findOne({ _id: id, user: user.id });
  if (!session) {
    return Response.json({ error: "找不到這場練習" }, { status: 404 });
  }
  if (session.status !== "active") {
    return Response.json({ error: "這場練習已經結束" }, { status: 409 });
  }

  const mode = resolvePracticeMode(session);
  if (!mode) {
    return Response.json({ error: "未知的練習場景或教材" }, { status: 400 });
  }

  let reply: string;
  try {
    reply = await chat(mode.systemPrompt, [
      // 對話紀錄是 AI 先開口，前面補上當初請它開場的那句
      { role: "user", content: mode.openingPrompt },
      ...session.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content },
    ]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 暫時無法回應，請稍後再試" }, { status: 502 });
  }

  // AI 成功回應後才把這一來一回存進資料庫
  session.messages.push({ role: "user", content }, { role: "assistant", content: reply });
  await session.save();

  const [userMessage, assistantMessage] = session.messages
    .slice(-2)
    .map((m) => ({ id: m._id.toString(), role: m.role, content: m.content }));

  return Response.json({ userMessage, reply: assistantMessage });
}
