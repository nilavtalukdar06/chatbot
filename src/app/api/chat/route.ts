import { streamText, UIMessage, convertToModelMessages } from "ai";
import { xai } from "@ai-sdk/xai";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: xai("grok-3-mini"),
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        await prisma.message.create({
          data: {
            type: "RESULT",
            role: "ASSISTANT",
            content: text,
            userId: session.user.id,
          },
        });
      },
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
