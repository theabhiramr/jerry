import pg from "pg";
import { query } from "../db/index.js";

/**
 * @param {pg.Pool | pg.PoolClient} pool
 * @returns {Promise<any>}
 */
export const create = (pool, { username, email, passwordHash }) =>
  query(
    pool,
    `INSERT INTO users (username, email, hash) VALUES ($1, $2, $3) RETURNING id, username, created_at`,
    [username, email || null, passwordHash],
  );

/**
 * @param {pg.Pool | pg.PoolClient } pool
 * @param {string} username
 * finds a user by username
 * @returns {Promise<any>}
 */
export const findByUsername = (pool, username) =>
  query(pool, `SELECT * FROM users WHERE username = $1`, [username]);

/**
 * @param {pg.Pool | pg.PoolClient } pool
 * @param {string} username
 * validates a user by password hash
 * @returns {Promise<any>}
 */
export const getPasswordHash = (pool, username) =>
  query(pool, `SELECT hash FROM users WHERE username = $1`, [username]);
