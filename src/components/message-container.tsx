"use client";

import { Message } from "@/generated/prisma/browser";
import { PromptInput } from "./prompt-input";
import { ScrollArea } from "./ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { dbMessageToUIMessage } from "@/utils/ui-messages";

interface Props {
  messages: Message[] | null;
}

export function MessageContainer({ messages: result }: Props) {
  const { messages, sendMessage } = useChat({
    id: "my-chat",
    messages: result?.map((message) => dbMessageToUIMessage(message)),
  });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 flex flex-col gap-y-4"></ScrollArea>
      <PromptInput sendMessage={sendMessage} />
    </div>
  );
}
