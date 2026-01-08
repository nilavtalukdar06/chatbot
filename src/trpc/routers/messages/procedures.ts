import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const result = await prisma.message.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }),
  create: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1, { message: "prompt is required" }),
      })
    )
    .mutation(async (opts) => {
      const result = await prisma.message.create({
        data: {
          type: "RESULT",
          content: opts.input.prompt,
          role: "USER",
          userId: opts.ctx.user.id,
        },
      });
      return result;
    }),
  deleteMany: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await prisma.message.deleteMany({
      where: {
        userId: ctx.user.id,
      },
    });
    return result;
  }),
});
