import { isValidObjectId } from "mongoose";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { PracticeSessionModel } from "@/models/PracticeSession";

// 結束一場練習（教材課程按「完成課程」時呼叫）
export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/sessions/[id]/complete">,
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await ctx.params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "找不到這場練習" }, { status: 404 });
  }

  await connectDB();
  // 查詢條件帶上 user，別人的練習一律當作不存在
  const session = await PracticeSessionModel.findOne({ _id: id, user: user.id });
  if (!session) {
    return Response.json({ error: "找不到這場練習" }, { status: 404 });
  }

  if (session.status === "active") {
    session.status = "completed";
    session.endedAt = new Date();
    await session.save();
  }

  return Response.json({ status: session.status, endedAt: session.endedAt });
}
