import { getCourse, getLesson, LEVELS, type Lesson } from "@/content/lessons";
import { buildSystemPrompt, OPENING_PROMPT } from "@/lib/claude";
import { getScenario } from "@/lib/scenarios";

// 練習有兩種：情境對話（scenario）和教材課程（lesson）
// 這裡把兩者統一成同一組資訊，API 和紀錄頁都用這個

export const LESSON_SCENARIO = "lesson";

const LESSON_OPENING_PROMPT = "Hi teacher, I'm ready to start today's lesson.";

export type PracticeMode = {
  label: string;
  emoji: string;
  systemPrompt: string;
  openingPrompt: string;
};

export function resolvePracticeMode(session: {
  scenario: string;
  lesson?: string | null;
}): PracticeMode | null {
  if (session.scenario === LESSON_SCENARIO) {
    const lesson = session.lesson ? getLesson(session.lesson) : undefined;
    if (!lesson) return null;
    return {
      label: lesson.title,
      emoji: getCourse(lesson.courseId)?.emoji ?? "📘",
      systemPrompt: buildLessonPrompt(lesson),
      openingPrompt: LESSON_OPENING_PROMPT,
    };
  }

  const scenario = getScenario(session.scenario);
  if (!scenario) return null;
  return {
    label: scenario.label,
    emoji: scenario.emoji,
    systemPrompt: buildSystemPrompt(scenario.persona),
    openingPrompt: OPENING_PROMPT,
  };
}

function buildLessonPrompt(lesson: Lesson) {
  const level = LEVELS.find((l) => l.id === lesson.level);
  return [
    "You are a warm, professional English teacher giving a one-on-one online lesson to a Taiwanese learner.",
    `Lesson: "${lesson.titleEn}" (CEFR ${lesson.level}${level ? `, ${level.description}` : ""}).`,
    `Situation: ${lesson.scene}`,
    "",
    "Target vocabulary:",
    ...lesson.vocabulary.map((v) => `- ${v.word}: ${v.example}`),
    "",
    "Target phrases:",
    ...lesson.phrases.map((p) => `- ${p.pattern} (e.g. ${p.examples[0]})`),
    "",
    "Lesson plan (follow these steps in order, one at a time):",
    ...lesson.tasks.map((t, i) => `${i + 1}. ${t}`),
    "",
    "How to teach:",
    `- Speak English at a ${lesson.level} level. Keep each turn short: 1 to 3 sentences, then wait for the student.`,
    "- Ask one question at a time and let the student do most of the talking.",
    "- Encourage the student to use the target phrases and vocabulary. If they don't, model the phrase and ask them to try again.",
    "- If the student makes a mistake that changes the meaning, briefly recast the correct sentence in a natural way, then continue. Don't explain grammar at length; the student has separate correction tools.",
    "- During role-plays, stay in your role; you may step out briefly to give a tip.",
    "- If the student writes in Chinese, gently answer in simple English and help them say it in English.",
    "- After the last step, praise one specific thing the student did well, give one tip for next time, and tell them they can click 「完成課程」 to finish the lesson.",
    "- Your first message: greet the student, say today's lesson topic in one sentence, and start step 1.",
  ].join("\n");
}
