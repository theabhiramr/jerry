import "dotenv/config";
import { createApp } from "app/app.js";
import { createPool } from "app/db";

const hostname = "localhost";
const port = 3000;
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://username:password@localhost:5432/mydatabase";
const db = createPool(connectionString);
const app = createApp({ db, options: {} });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
