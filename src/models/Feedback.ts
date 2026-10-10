import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// 每一筆糾錯或建議，對應到某場練習中的某一則使用者訊息
const feedbackSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    session: {
      type: Schema.Types.ObjectId,
      ref: "PracticeSession",
      required: true,
    },
    // 被糾錯的那則訊息（PracticeSession.messages 裡的 _id）
    messageId: { type: Schema.Types.ObjectId, required: true },
    // correction = 錯誤修正；suggestion = 更自然的說法建議
    type: {
      type: String,
      enum: ["correction", "suggestion"],
      required: true,
    },
    category: {
      type: String,
      enum: ["grammar", "vocabulary", "spelling", "expression", "other"],
      default: "other",
    },
    original: { type: String, required: true },
    corrected: { type: String, required: true },
    explanation: { type: String, default: "" },

    // 使用者在練習過程中有沒有採用這個糾錯／建議
    applied: { type: Boolean, default: false },
    appliedAt: { type: Date },
    // 使用者在哪一則訊息裡用上了這個建議
    appliedMessageId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

feedbackSchema.index({ user: 1, session: 1, createdAt: 1 });
feedbackSchema.index({ messageId: 1 });

export type Feedback = InferSchemaType<typeof feedbackSchema>;

// 開發模式改了 schema 後 hot reload，要換掉記憶體裡舊的 model 才會生效
if (mongoose.models.Feedback) mongoose.deleteModel("Feedback");

export const FeedbackModel: Model<Feedback> = mongoose.model<Feedback>(
  "Feedback",
  feedbackSchema,
);
