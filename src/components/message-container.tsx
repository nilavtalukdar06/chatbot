"use client";

import { PromptInput } from "./prompt-input";

export function MessageContainer() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col gap-y-4"></div>
      <PromptInput />
    </div>
  );
}
