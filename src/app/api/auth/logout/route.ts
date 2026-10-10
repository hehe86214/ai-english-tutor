import { deleteLoginSession } from "@/lib/auth";

export async function POST() {
  await deleteLoginSession();
  return Response.json({ ok: true });
}
