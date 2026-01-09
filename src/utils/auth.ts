import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

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
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "6659225f-fee6-4089-9d03-170b70757f77",
              slug: "Chatbot-Pro-Plan",
            },
          ],
          successUrl: "/",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onOrderPaid: async (payload) => {
            const externalId = payload.data.customer.externalId;
            if (!externalId) {
              return;
            }
            try {
              await prisma.$transaction(async (tx) => {
                await tx.user.findUniqueOrThrow({
                  where: {
                    id: externalId,
                  },
                });
                await tx.user.update({
                  where: {
                    id: externalId,
                  },
                  data: {
                    status: "pro_user",
                  },
                });
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const externalId = payload.data.customer.externalId;
            if (!externalId) {
              return;
            }
            try {
              await prisma.$transaction(async (tx) => {
                await tx.user.findUniqueOrThrow({
                  where: {
                    id: externalId,
                  },
                });
                await tx.user.update({
                  where: {
                    id: externalId,
                  },
                  data: {
                    status: "free_user",
                  },
                });
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
        }),
      ],
    }),
  ],
});
