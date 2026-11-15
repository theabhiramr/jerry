import pg from "pg";

export function createPool(connectionString) {
  // will need to set up actual transaction stuff with begin/commit/rollback. helper method.
  const pool = new pg.Pool({ connectionString });
  return pool;
}
