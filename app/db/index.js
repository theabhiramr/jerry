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
  try {
    await pool.query("BEGIN");
    let result = await pool.query(q, values);
    await pool.query("COMMIT");
    return result;
  } catch (err) {
    console.error(err);
    await pool.query("ROLLBACK");
  } finally {
    await pool.release();
  }
}

/**
 * @param {pg.Pool | pg.PoolClient} pool
 */
export async function one(pool, q, values) {
  return await query(pool, q, values)?.[0];
}
