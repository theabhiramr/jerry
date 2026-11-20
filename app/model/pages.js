import { one } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const create = (pool, { siteId, title, slug }) =>
  one(
    pool,
    `
    INSERT INTO pages (site_id, title, slug)
    VALUES ($1, $2, $3)
    RETURNING id, site_id, slug, created_at
    `,
    [siteId, title, slug],
  );
