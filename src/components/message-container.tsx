"use client";

import { PromptInput } from "./prompt-input";
import { ScrollArea } from "./ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { dbMessageToUIMessage, ExtendedUIMessage } from "@/utils/ui-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Claude } from "@lobehub/icons";
import { format } from "date-fns";

export function MessageContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.message.getMany.queryOptions());
  const { messages, sendMessage } = useChat<ExtendedUIMessage>({
    id: "my-chat",
    messages: data?.map((message) => dbMessageToUIMessage(message)).reverse(),
  });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 flex flex-col gap-y-4 p-4 overflow-auto">
        {messages.map((message, index) => (
          <Message from={message.role} key={index}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div className="space-y-4">
                        {message.role === "assistant" && (
                          <div className="flex flex-col items-start justify-center gap-y-2">
                            <div className="flex justify-start items-center gap-x-2">
                              <Claude.Color size={18} />
                              <Claude.Text size={14} />
                            </div>
                            <p className="text-muted-foreground text-xs font-light">
                              {format(
                                message?.metadata?.createdAt || new Date(),
                                "MMM d, yyyy, h:mm a"
                              )}
                            </p>
                          </div>
                        )}
                        <MessageResponse key={`${message.role}-${i}`}>
                          {part.text}
                        </MessageResponse>
                      </div>
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
