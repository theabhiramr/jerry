// I am thinking of a middleware here incase we decide we want to support subdomain based pathing
import * as sites from "../model/sites.js";

/**
 * @type {import("express").RequestHandler}
 */
export const site = async (req, _res, next) => {
  // get current site. extract from request body likely no matter if we do subdomains or path based routing.
  const { siteId } = req.body ?? {};
  // for now I am just going to leave site information like name, slug, description, etc readable here. maybe in the future we don't want to pull all the data pre-auth
  req.site = siteId ? await sites.selectSiteById(req.db, siteId) : null;
  next();
  return;
};
