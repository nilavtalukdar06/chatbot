import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  user: {
    additionalFields: {
      status: {
        type: ["free_user", "pro_user"],
        required: true,
        defaultValue: "free_user",
        input: false,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
