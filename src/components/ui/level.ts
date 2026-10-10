import type { Level } from "@/content/lessons";

// 等級徽章的顏色：A1 綠、A2 黃、B1 橘、B2 紅橘
export const LEVEL_PILL: Record<Level, string> = {
  A1: "bg-leaf text-white",
  A2: "bg-sun text-sun-ink",
  B1: "bg-flame text-white",
  B2: "bg-coral text-white",
};

// 課程封面照片
export const COURSE_IMAGES: Record<string, string> = {
  daily: "/images/daily.jpg",
  travel: "/images/travel.jpg",
  dining: "/images/dining.jpg",
  business: "/images/business.jpg",
  interview: "/images/interview.jpg",
  discussion: "/images/discussion.jpg",
};
