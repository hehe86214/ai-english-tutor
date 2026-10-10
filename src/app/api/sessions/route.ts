import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { buildSystemPrompt, chat, OPENING_PROMPT } from "@/lib/claude";
import { getScenario } from "@/lib/scenarios";
import { PracticeSessionModel } from "@/models/PracticeSession";

// 開始一場新的練習：AI 先開口問第一句
export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const scenario = getScenario(body?.scenario);
  if (!scenario) {
    return Response.json({ error: "未知的練習場景" }, { status: 400 });
  }

  let opening: string;
  try {
    opening = await chat(buildSystemPrompt(scenario.persona), [
      { role: "user", content: OPENING_PROMPT },
    ]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 暫時無法回應，請稍後再試" }, { status: 502 });
  }

  await connectDB();
  const session = await PracticeSessionModel.create({
    user: user.id,
    title: scenario.label,
    scenario: scenario.id,
    messages: [{ role: "assistant", content: opening }],
  });
  const message = session.messages[0];

  return Response.json({
    sessionId: session._id.toString(),
    message: {
      id: message._id.toString(),
      role: message.role,
      content: message.content,
    },
  });
}
