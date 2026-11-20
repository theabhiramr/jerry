import express from "express";
import { requireUser } from "../middleware/session.js";
import * as sites from "../model/sites.js";

export function siteRouter() {
	const router = express.Router();

	router.post("/", requireUser, async (req, res) => {
		const site = req.tx(async (client) => {
			const site = await sites.create(client, {
				...req.body,
				owner_id: req.user.id,
			});
			sites.addMemberToSite(client, {
				siteId: site.id,
				userId: req.user.id,
				role: "admin",
			});
			return site;
		});

		res.status(201).json(site);
	});

	router.get("/", async (req, res) => {
		const { rows } = await sites.selectAll(req.db);
		res.status(200).json({ sites: rows });
	});

	return router;
}
