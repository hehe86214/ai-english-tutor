import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getLesson } from "@/content/lessons";
import { chat } from "@/lib/ai";
import { LESSON_SCENARIO, resolvePracticeMode } from "@/lib/practice-mode";
import { getScenario } from "@/lib/scenarios";
import { PracticeSessionModel } from "@/models/PracticeSession";

// 開始一場新的練習：AI 先開口問第一句
// body 帶 { scenario } 是情境對話，帶 { lessonId } 是教材課程
export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const lesson = typeof body?.lessonId === "string" ? getLesson(body.lessonId) : undefined;
  const scenario = lesson ? undefined : getScenario(body?.scenario);
  if (!lesson && !scenario) {
    return Response.json({ error: "未知的練習場景或教材" }, { status: 400 });
  }

  const fields = lesson
    ? { scenario: LESSON_SCENARIO, lesson: lesson.id, title: lesson.title }
    : { scenario: scenario!.id, title: scenario!.label };
  const mode = resolvePracticeMode(fields)!;

  let opening: string;
  try {
    opening = await chat(mode.systemPrompt, [
      { role: "user", content: mode.openingPrompt },
    ]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI 暫時無法回應，請稍後再試" }, { status: 502 });
  }

  await connectDB();
  const session = await PracticeSessionModel.create({
    user: user.id,
    ...fields,
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
