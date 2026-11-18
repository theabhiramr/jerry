import { createApp } from "../app.js";
const authRouter = await import("./auth.js");

export default function indexRoute(app) {
  app.use("/auth", authRouter);
  return app;
}
