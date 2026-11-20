import express from "express";

import cookieParser from "cookie-parser";
import { authRouter } from "./auth.js";
import { session } from "../middleware/session.js";
import { siteRouter } from "./site.js";
import { database } from "../middleware/db.js";

/**
 * @param {Object} params
 * @param {import("pg").Pool} params.pool
 */
export function apiRouter({ pool }) {
	const router = express.Router();
	router.use(express.json());
	router.use(cookieParser());
	// TODO: evaluate if we need database on all paths? or go back to injection, but it would be nice to have shared sessions per request. build tree?
	router.use(database(pool));
	router.use(session);

	router.use("/auth", authRouter());
	router.use("/site", siteRouter());

	return router;
}
