"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { type Question } from "@bigfive-org/questions";
import type { LanguageCode } from "@bigfive-org/questions/build/data/languages";
import { Survey } from "./survey";

interface Props {
  questions: Question[];
  nextText: string;
  prevText: string;
  resultsText: string;
  saveTest: Function;
  language: LanguageCode;
}

const generateChallenge = (length = 3) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // letters only
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

export const GatedSurvey = ({
  questions,
  nextText,
  prevText,
  resultsText,
  saveTest,
  language
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const challenge = useMemo(() => generateChallenge(8), []);
  const matches = inputValue.trim().toUpperCase() === challenge;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (matches) setUnlocked(true);
  };

  if (unlocked) {
    return (
      <Survey
        questions={questions}
        nextText={nextText}
        prevText={prevText}
        resultsText={resultsText}
        saveTest={saveTest}
        language={language}
      />
    );
  }

  return (
    <div className="max-w-xl space-y-6 mt-8">
      <div className="space-y-2">
        <p className="text-lg font-semibold">テストを開始する前に入力してください</p>
        <p className="text-default-600">
          表示されているテキストをそのままタイピングしてください。
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl px-3 py-2 bg-default-100 rounded-md border border-default-200">
            {challenge}
          </span>
          <span className="text-sm text-default-500">小文字でもOKです</span>
        </div>
        <Input
          label="テキストを入力"
          placeholder={challenge}
          value={inputValue}
          onValueChange={setInputValue}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <p className="text-sm text-default-500">Enter キーか下のボタンで開始できます。</p>
        <Button color="primary" onPress={handleSubmit} isDisabled={!matches}>
          ENTER
        </Button>
      </div>
    </div>
  );
};
