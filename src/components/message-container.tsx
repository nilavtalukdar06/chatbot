"use client";

import { PromptInput } from "./prompt-input";
import { ScrollArea } from "./ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { dbMessageToUIMessage } from "@/utils/ui-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

export function MessageContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.message.getMany.queryOptions());
  const { messages, sendMessage } = useChat({
    id: "my-chat",
    messages: data?.map((message) => dbMessageToUIMessage(message)).reverse(),
  });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 flex flex-col gap-y-4 p-4 overflow-auto">
        {messages.map(({ role, parts }, index) => (
          <Message from={role} key={index}>
            <MessageContent>
              {parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <MessageResponse key={`${role}-${i}`}>
                        {part.text}
                      </MessageResponse>
                    );
                }
              })}
            </MessageContent>
          </Message>
        ))}
      </ScrollArea>
      <PromptInput sendMessage={sendMessage} />
    </div>
  );
}
