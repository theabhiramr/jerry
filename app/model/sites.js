import { one, query } from "../db/index.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const create = (pool, { slug, name, description, owner_id }) =>
  one(
    pool,
    `
    INSERT INTO sites (slug, name, description, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, slug, name, description, owner_id, created_at
    `,
    [slug, name, description || null, owner_id],
  );

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const selectSiteById = (pool, siteId) =>
  one(
    pool,
    "SELECT id, slug, name, description, created_at FROM sites WHERE id = $1",
    [siteId],
  );

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 * TODO: add owner role
 */
export const addMemberToSite = (pool, { siteId, userId, role }) =>
  one(
    pool,
    `
		INSERT INTO site_members (site_id, user_id, role)
		VALUES ($1, $2, $3)
		RETURNING site_id, user_id, role, created_at
		`,
    [siteId, userId, role],
  );

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const selectAll = (pool) =>
  query(
    pool,
    "SELECT id, slug, name, description, owner_id, created_at FROM sites",
    [],
  );

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const selectSitesByOwnerId = (pool, ownerId) =>
  query(
    pool,
    "SELECT slug, name, description, created_at FROM sites WHERE owner_id = $1",
    [ownerId],
  );

/**
 * @param {import("pg").Pool | import("pg").PoolClient} pool
 */
export const userSiteRole = (pool, { siteId, userId }) =>
  one(
    pool,
    "SELECT role FROM site_members WHERE site_id = $1 AND user_id = $2",
    [siteId, userId],
  );
