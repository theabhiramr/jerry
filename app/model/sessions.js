import crypto from "node:crypto";
import { one, query } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} userId
 * TODO: insert hash of token instead of actual token
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
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} token
 */
export const findUser = async (pool, token) =>
  (await one(
    pool,
    `SELECT u.id, u.username
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token = $1 AND s.expires_at > now() AND u.active`,
    [token],
  )) ?? null;

/**
 * delete is not a valid js var name for obvious reasons smh...
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * @param {string} token
 */
export const remove = (pool, token) =>
  query(pool, `DELETE FROM sessions WHERE token = $1`, [token]);
