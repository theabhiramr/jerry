import { createApp } from "../app.js";
const authRouter = await import("./auth.js");

export default function indexRoute({ db, options }) {
  const app = createApp({ db, options });

  app.use("/auth", authHandler);

  return app;
}
