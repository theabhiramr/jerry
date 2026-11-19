import type { User } from "./model/index.d.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "username"> | null;
    }
  }
}
