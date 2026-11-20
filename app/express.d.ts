import { PoolClient } from "pg";
import type { Site, User } from "./model/index.d.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "username"> | null;
      site?: Pick<Site, "id" | "slug"> | null;
      db?: PoolClient | null;
      tx?: <T>(fn: (client: PoolClient) => Promise<T>) => Promise<T> | null;
    }
  }
}
