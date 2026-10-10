import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { io } from "next/cache";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { AuthSessionModel } from "@/models/AuthSession";
import { UserModel } from "@/models/User";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const COOKIE_NAME = "session";
const SESSION_DAYS = 30;
const KEY_LENGTH = 64;

// 給前端看的使用者資料，只放安全的欄位
export type CurrentUser = { id: string; name: string; email: string };

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// 登入成功後呼叫：建立 session 並寫入 httpOnly cookie
export async function createLoginSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await connectDB();
  await AuthSessionModel.create({
    tokenHash: hashToken(token),
    user: userId,
    expiresAt,
  });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await connectDB();
    await AuthSessionModel.deleteOne({ tokenHash: hashToken(token) });
  }
  cookieStore.delete(COOKIE_NAME);
}

// 從 cookie 找出目前登入的使用者；沒登入或 session 過期回傳 null
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  // 下面要用 new Date() 判斷是否過期；io() 告訴 Next.js 這段不能預先渲染
  await io();
  await connectDB();
  const session = await AuthSessionModel.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const user = await UserModel.findById(session.user);
  if (!user) return null;

  return { id: user._id.toString(), name: user.name, email: user.email };
}

// API 用：沒登入就回 401
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      error: Response.json({ error: "請先登入" }, { status: 401 }),
    } as const;
  }
  return { user, error: null } as const;
}
