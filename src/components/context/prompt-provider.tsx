"use client";

import { createContext, useState } from "react";

interface ContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptContext = createContext<ContextType | null>(null);

export function PromptProvider({ children }: child) {
  const [prompt, setPrompt] = useState<string>("");
  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
}
