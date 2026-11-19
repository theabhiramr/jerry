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
export const selectAll = (pool) =>
	query(
		pool,
		"SELECT slug, name, description, owner_id, created_at FROM sites",
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
