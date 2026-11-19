import express from "express";
import { requireUser } from "../middleware/session.js";
import * as sites from "../model/sites.js";

export function siteRouter({ db, options }) {
	const router = express.Router();

	router.post("/", requireUser, async (req, res) => {
		const site = await sites.create(db, {
			...req.body,
			owner_id: req.user.id,
		});
		res.status(201).json(site);
	});

	router.get("/", async (_req, res) => {
		const { rows } = await sites.selectAll(db);
		res.status(200).json({ sites: rows });
	});

	return router;
}
