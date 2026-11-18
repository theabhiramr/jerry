import express from "express";

import cookieParser from "cookie-parser";
import { authRouter } from "./auth.js";

export function apiRouter({ db, options }) {
  const router = express.Router();
  router.use(express.json());
  router.use(cookieParser());
  router.use("/auth", authRouter({ db, options }));

  return router;
}
