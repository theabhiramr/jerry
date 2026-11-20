import "dotenv/config";
import path from "node:path";
import { createApp } from "./app/app.js";
import { createPool } from "./app/db/index.js";
import { migrate } from "./app/db/migrate.js";

const port = Number(process.env.PORT ?? 3000);
const pool = createPool(
  process.env.DATABASE_URL ?? "postgresql://jerry:jerry@localhost:5432/jerry",
);

await migrate(pool, path.join(import.meta.dirname, "migrations"));
const app = createApp({ pool });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}/`);
});
