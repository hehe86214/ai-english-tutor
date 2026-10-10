import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// 一則對話訊息（嵌入在 PracticeSession 裡）
const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// 一場練習：包含完整的對話紀錄
const practiceSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "" },
    // 練習情境，例如 "ordering coffee"、"job interview"
    scenario: { type: String, default: "free talk" },
    // 教材課程的 lesson id（scenario 為 "lesson" 時才有）
    lesson: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    messages: { type: [messageSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true },
);

practiceSessionSchema.index({ user: 1, createdAt: -1 });

export type PracticeSession = InferSchemaType<typeof practiceSessionSchema>;

// 開發模式改了 schema 後 hot reload，要換掉記憶體裡舊的 model 才會生效
if (mongoose.models.PracticeSession) mongoose.deleteModel("PracticeSession");

export const PracticeSessionModel: Model<PracticeSession> = mongoose.model<PracticeSession>(
  "PracticeSession",
  practiceSessionSchema,
);
