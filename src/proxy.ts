import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),
    shield({
      mode: "LIVE",
    }),
  ],
});

export default createMiddleware(aj);
