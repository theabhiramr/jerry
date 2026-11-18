import pg from "pg";

export function createPool(connectionString) {
  // will need to set up actual transaction stuff with begin/commit/rollback. helper method.
  const pool = new pg.Pool({ connectionString });
  return pool;
}
/**
 * @param {pg.Pool | pg.PoolClient} pool
 */
export async function query(pool, q, values) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let result = await pool.query(q, values);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    console.error(err);
    await client.query("ROLLBACK");
  } finally {
    await client.release();
  }
}

/**
 * @param {pg.Pool | pg.PoolClient} pool
 */
export async function one(pool, q, values) {
  return await query(pool, q, values)?.[0];
}
