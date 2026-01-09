import prisma from "@/lib/prisma";
import { consumeCredits } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
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
      try {
        await consumeCredits(opts.ctx.user.id, opts.ctx.user.status);
      } catch (error) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: "Prompt limit exceeded for today",
        });
      }
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
