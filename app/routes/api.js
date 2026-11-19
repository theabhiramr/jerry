import express from "express";

import cookieParser from "cookie-parser";
import { authRouter } from "./auth.js";
import { session } from "../middleware/session.js";

export function apiRouter({ db, options }) {
	const router = express.Router();
	router.use(express.json());
	router.use(cookieParser());
	router.use(session(db));
	router.use("/auth", authRouter({ db, options }));

	return router;
}
