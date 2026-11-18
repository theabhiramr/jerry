import { query } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const create = (pool, { site, title, slug }) =>
  query(
    pool,
    `
    INSERT INTO pages (site_id, title, slug)
    VALUES ($1, $2, $3)
    RETURNING id, site_id, slug, created_at
    `,
    [site, title, slug],
  );
