import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// 登入狀態：cookie 裡放隨機 token，資料庫只存它的 SHA-256 雜湊
const authSessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// 過期後由 MongoDB 自動刪除
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AuthSession = InferSchemaType<typeof authSessionSchema>;

// 開發模式改了 schema 後 hot reload，要換掉記憶體裡舊的 model 才會生效
if (mongoose.models.AuthSession) mongoose.deleteModel("AuthSession");

export const AuthSessionModel: Model<AuthSession> = mongoose.model<AuthSession>(
  "AuthSession",
  authSessionSchema,
);
