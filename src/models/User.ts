import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    // scrypt 雜湊，格式為 "salt:hash"，絕對不能回傳給前端
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;

// 開發模式改了 schema 後 hot reload，要換掉記憶體裡舊的 model 才會生效
if (mongoose.models.User) mongoose.deleteModel("User");

export const UserModel: Model<User> = mongoose.model<User>(
  "User",
  userSchema,
);
