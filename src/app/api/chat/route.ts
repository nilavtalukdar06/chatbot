import { streamText, UIMessage, convertToModelMessages } from "ai";
import { xai } from "@ai-sdk/xai";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 5,
      capacity: 25,
    }),
  ],
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const decision = await aj.protect(request, {
      userId: session.user.id,
      requested: 5,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
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
