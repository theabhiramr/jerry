import { query } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const create = (pool, { slug, name, description, owner_id }) =>
  query(
    pool,
    `
    INSERT INTO sites (slug, name, description, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, slug, name, created_at
    `,
    [slug, name, description || null, owner_id],
  );

// TODO: handle unique constraint violation
