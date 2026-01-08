"use client";

import { Message } from "@/generated/prisma/browser";
import { PromptInput } from "./prompt-input";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  messages: Message[] | null;
}

export function MessageContainer({ messages }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 flex flex-col gap-y-4"></ScrollArea>
      <PromptInput />
    </div>
  );
}
