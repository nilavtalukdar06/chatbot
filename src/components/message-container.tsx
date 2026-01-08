"use client";

import { PromptInput } from "./prompt-input";
import { ScrollArea } from "./ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { dbMessageToUIMessage } from "@/utils/ui-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MessageContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.message.getMany.queryOptions());
  const { messages, sendMessage } = useChat({
    id: "my-chat",
    messages: data?.map((message) => dbMessageToUIMessage(message)).reverse(),
  });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 flex flex-col gap-y-4"></ScrollArea>
      <PromptInput sendMessage={sendMessage} />
    </div>
  );
}
