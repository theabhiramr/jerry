import express from "express";
import { requireUser } from "../middleware/session.js";
import * as pages from "../model/pages.js";
import { requireMinRole } from "../middleware/auth.js";
import { site } from "../middleware/site.js";

export function pageRouter() {
  const router = express.Router();
  router.use(site); // also will require having a site to do stuff with a page

  router.post("/", requireUser, requireMinRole("admin"), async (req, res) => {
    const page = await pages.create(req.db, {
      ...req.body,
      owner_id: req.user?.id,
    });

    res.status(201).json({ page });
  });

  return router;
}
