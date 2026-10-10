"use client";

import { useRef, useState, useSyncExternalStore } from "react";

// 瀏覽器內建的語音功能：朗讀（speechSynthesis）和語音輸入（SpeechRecognition）
// 不同瀏覽器支援度不同，不支援時按鈕會自動隱藏

type RecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noopSubscribe = () => () => {};

export function useSpeechSupport() {
  const tts = useSyncExternalStore(
    noopSubscribe,
    () => "speechSynthesis" in window,
    () => false,
  );
  const stt = useSyncExternalStore(
    noopSubscribe,
    () => getRecognitionCtor() !== undefined,
    () => false,
  );
  return { tts, stt };
}

function pickVoice() {
  return window.speechSynthesis
    .getVoices()
    .find((v) => v.lang === "en-US" && /natural|samantha|google/i.test(v.name));
}

export function speak(text: string) {
  speakSequence([text]);
}

// 依序朗讀多句（例如整段範例對話），voices 可以讓 A、B 用不同聲音
export function speakSequence(texts: string[], voices?: (SpeechSynthesisVoice | undefined)[]) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const fallback = pickVoice();
  texts.forEach((text, i) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    const voice = voices?.[i] ?? fallback;
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// 取兩個不同的英文聲音，給對話的 A、B 角色
export function getDialogueVoices() {
  const english = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
  return [english[0], english.find((v) => v !== english[0]) ?? english[0]] as const;
}

// 語音輸入：講英文 → 轉成文字，回呼 onText(目前辨識到的完整文字)
export function useDictation(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);

  function start(prefix: string) {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recognitionRef.current) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalText = "";
    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interim += result[0].transcript;
      }
      onText(`${prefix}${prefix && !prefix.endsWith(" ") ? " " : ""}${finalText}${interim}`.trimStart());
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = recognition.onend;

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  return { listening, start, stop };
}
