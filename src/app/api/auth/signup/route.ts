import { createLoginSession, hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || name.length > 50) {
    return Response.json({ error: "請輸入 1～50 字的名字" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Email 格式不正確" }, { status: 400 });
  }
  if (password.length < 8 || password.length > 100) {
    return Response.json({ error: "密碼至少要 8 個字元" }, { status: 400 });
  }

  await connectDB();
  if (await UserModel.exists({ email })) {
    return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
  }

  const user = await UserModel.create({
    name,
    email,
    passwordHash: await hashPassword(password),
  });
  await createLoginSession(user._id.toString());

  return Response.json({ user: { id: user._id.toString(), name, email } });
}
