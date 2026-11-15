import pg from "pg";

/**
 * @param {pg.Pool | pg.PoolClient} pool
 * returns a promise
 * @returns {Promise<any>}
 */
export const create = (pool, { username, email, passwordHash }) =>
  pool.query(
    `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, is_site_admin, created_at`,
    [username, email || null, passwordHash],
  );
