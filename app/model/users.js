import pg from "pg";

/**
 * @param {pg.Pool | pg.PoolClient} pool
 * returns a promise
 * @returns {Promise<any>}
 */
export const create = (pool, { username, email, passwordHash }) =>
  pool.query(
    `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, created_at`,
    [username, email || null, passwordHash],
  );

/**
 * @param {pg.Pool | pg.PoolClient } pool
 * @param {string} username
 * finds a user by username
 * @returns {Promise<any>}
 */
export const findByUsername = (pool, username) =>
  pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
