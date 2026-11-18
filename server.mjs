import "dotenv/config";
import { createApp } from "./app/app.js";
import { createPool } from "./app/db/index.js";

const hostname = "0.0.0.0";
const port = 3000;
const connectionString =
  process.env.DATABASE_URL || "postgresql://jerry:jerry@postgres:5432/jerry";
const pool = createPool(connectionString);
console.log("got db");
const app = createApp({ db: pool, options: {} });
console.log("created app");

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
