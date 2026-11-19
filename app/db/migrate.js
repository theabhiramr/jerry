/**
 * @import pg from "pg"
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { tx } from "./index.js";

/**
 * @param {string} sql
 */
const checksum = (sql) =>
  createHash("sha256").update(sql.replace(/\r\n/g, "\n")).digest("hex");

/**
 * @param {pg.Pool} pool
 * @param {any} dir
 */
export async function migrate(pool, dir) {
  // inspired in part from sqlx
  await pool.query(`CREATE TABLE IF NOT EXISTS _migrations (
    name        text PRIMARY KEY,
    checksum    text NOT NULL,
    applied_at  timestamptz NOT NULL DEFAULT now()
  )`);

  const { rows } = await pool.query("SELECT name, checksum FROM _migrations");
  const applied = new Map(rows.map((r) => [r.name, r.checksum]));

  const files = (await readdir(dir))
    .filter((f) => /^\d+_.+\.sql$/.test(f))
    .sort();
  for (const file of files) {
    const sql = await readFile(path.join(dir, file), "utf8");
    const sum = checksum(sql);

    if (applied.has(file)) {
      if (applied.get(file) !== sum) {
        throw new Error(`${file} was edited`);
      }
      continue;
    }

    try {
      await tx(pool, async (client) => {
        await client.query(sql);
        await client.query(
          "INSERT INTO _migrations (name, checksum) VALUES ($1, $2)",
          [file, sum],
        );
      });
    } catch (err) {
      throw new Error(`${file}: ${err.message}`, { cause: err });
    }
    console.log(`applied migration ${file}`);
  }
}
