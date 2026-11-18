import express from "express";
import { authRouter } from "./auth.js";

export function apiRouter({ db, options }) {
  const router = express.Router();

  router.use("/auth", authRouter({ db, options }));

  return router;
}
