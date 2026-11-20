import * as sites from "../model/sites.js";

/**
 * @param {"admin" | "editor" | "member"} role
 * @param {"admin" | "editor" | "member"} userRole
 * @returns {boolean}
 */
function compareRole(role, userRole) {
  console.log(`comparing roles ${role} and ${JSON.stringify(userRole)}`);
  if (role === userRole) return true;
  if (userRole === "admin") return true;
  if ((role === "editor" || role === "member") && userRole === "editor")
    return true;
  return false;
}

/**
 * @param {"admin" | "editor" | "member"} role
 */
export function requireMinRole(role) {
  /** @type {import("express").RequestHandler} */
  return async (req, res, next) => {
    const userRole = await sites.userSiteRole(req.db, {
      siteId: req.site?.id,
      userId: req.user?.id,
    });

    if (!compareRole(role, userRole.role)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    next();
  };
}
