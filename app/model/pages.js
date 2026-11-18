import { query } from "../db";

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
