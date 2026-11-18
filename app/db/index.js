import pg from "pg";

/**
 * @param {string} connectionString
 * @returns {import("pg").Pool}
 */
export function createPool(connectionString) {
  return new pg.Pool({ connectionString });
}

/**
 * @param {import("pg").Pool | import("pg").PoolClient} db
 * @param {string | import("pg").QueryArrayConfig<any>} sql
 * @param {any[]} params
 */
export function query(db, sql, params) {
  return db.query(sql, params);
}

/**
 * @param {import("pg").Pool | import("pg").PoolClient} db
 * @param {string | import("pg").QueryArrayConfig<any>} sql
 * @param {any[]} params
 */
export async function one(db, sql, params) {
  return (await db.query(sql, params)).rows[0];
}

/**
 * @template T
 * @param {import("pg").Pool} pool
 * @param {(client: import("pg").PoolClient) => T} fn
 * @returns {Promise<T>}
 */
async function tx(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
