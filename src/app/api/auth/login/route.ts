import { createLoginSession, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json({ error: "請輸入 Email 和密碼" }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findOne({ email });
  // 不區分「沒有這個帳號」和「密碼錯」，避免被拿來猜帳號
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "Email 或密碼錯誤" }, { status: 401 });
  }

  await createLoginSession(user._id.toString());
  return Response.json({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });
}
