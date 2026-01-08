import { createTRPCRouter } from "../init";
import { messagesRouter } from "./messages/procedures";

export const appRouter = createTRPCRouter({
  message: messagesRouter,
});

export type AppRouter = typeof appRouter;
