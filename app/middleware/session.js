import * as sessions from "../model/sessions.js";

/** @type {import("express").RequestHandler} */
export const session = async (req, _res, next) => {
  const token = req.cookies?.token;
  req.user = token ? await sessions.findUser(req.db, token) : null;
  next();
  return;
};

// TODO: evaluate merging into a more general permission middleware options.

/** @type {import("express").RequestHandler} */
export const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
};
