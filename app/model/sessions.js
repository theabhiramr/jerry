import crypto from "node:crypto";
import { one, query } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} userId
 */
export async function create(pool, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  await query(
    pool,
    `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, now() + interval '7 days')`,
    [userId, token],
  );
  return token;
}

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} token
 */
export const findUserId = async (pool, token) =>
  (
    await one(
      pool,
      `SELECT user_id FROM sessions WHERE token = $1 AND expires_at > now()`,
      [token],
    )
  )?.user_id;

/**
 * delete is not a valid js var name for obvious reasons smh...
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} token
 */
export const remove = (pool, token) =>
  query(pool, `DELETE FROM sessions WHERE token = $1`, [token]);
