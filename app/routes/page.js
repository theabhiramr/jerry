import express from "express";
import { requireUser } from "../middleware/session.js";
import * as pages from "../model/pages.js";

export function pageRouter({ db, options }) {
  const router = express.Router();

  router.post("/", requireUser, async (req, res) => {
    const page = await pages.create(db, {
      ...req.body,
      owner_id: req.user.id,
    });
  });
}
