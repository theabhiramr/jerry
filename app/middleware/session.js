import * as sessions from "../model/sessions.js";

/**
 * @param {import("pg").Pool | import("pg").PoolClient} db
 * @return {import("express").RequestHandler}
 */
export function session(db) {
  return async (req, _res, next) => {
    const token = req.cookies?.token;
    req.user = token ? await sessions.findUser(db, token) : null;
    next();
  };
}

/** @type {import("express").RequestHandler} */
export const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
};
