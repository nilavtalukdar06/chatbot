import { Message } from "@/generated/prisma/browser";
import type { UIMessage } from "ai";

export interface ExtendedUIMessage extends UIMessage {
  metadata?: {
    type: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const dbMessageToUIMessage = (message: Message): ExtendedUIMessage => {
  return {
    id: message.id,
    role: message.role.toLowerCase() as "system" | "user" | "assistant",
    parts: [{ type: "text", text: message.content }],
    metadata: {
      type: message.type.toLowerCase(),
      userId: message.userId,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    },
  };
};
