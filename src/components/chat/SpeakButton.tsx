"use client";

import { speak, useSpeechSupport } from "./speech";

export default function SpeakButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { tts } = useSpeechSupport();
  if (!tts) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label="朗讀"
      title="朗讀"
      className={`grid size-7 shrink-0 place-items-center rounded-full text-faint transition hover:bg-sunken hover:text-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden>
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
