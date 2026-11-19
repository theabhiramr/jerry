import express from "express";
import argon2 from "argon2";
import crypto from "crypto";
import { create, findByUsername, getPasswordHash } from "../model/users.js";
import * as sessions from "../model/sessions.js";

const isEmpty = (value) =>
  value == null || (typeof value === "string" && value.trim() === "");

export function authRouter({ db, options }) {
  const router = express.Router();

  const WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

  /** @type {import("express").CookieOptions} */
  let cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: WEEK_IN_MS,
  };

  let tokens = {};

  function validLoginBody(body) {
    if (!body.hasOwnProperty("username") || !body.hasOwnProperty("password")) {
      return false;
    }
    let { username, password } = body;
    return (
      typeof username === "string" &&
      typeof password === "string" &&
      username.length >= 1 &&
      username.length <= 25
    );
  }

  function generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  router.post("/register", async (req, res) => {
    if (!validLoginBody(req.body)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    let { username, password, email } = req.body;

    let result;
    try {
      result = await findByUsername(db, username);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    let passwordHash;
    try {
      passwordHash = await argon2.hash(password);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    try {
      result = await create(db, { username, email, passwordHash });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    let token = generateToken();
    tokens[token] = result.rows[0].id;
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ message: "Success" });
  });

  router.post("/login", async (req, res) => {
    if (!validLoginBody(req.body)) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }
    let { username, password } = req.body;

    let result;
    try {
      result = await getPasswordHash(db, username);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    if (result === null) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }

    let passwordHash = result.hash;
    try {
      if (!(await argon2.verify(passwordHash, password))) {
        return res
          .status(400)
          .json({ error: "Incorrect username or password" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    const token = await sessions.create(db, result.id);
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ message: "Success" });
  });

  router.post("/logout", async (req, res) => {
    let { token } = req.cookies;
    if (!isEmpty(token)) {
      await sessions.remove(db, token);
    }
    return res
      .clearCookie("token", cookieOptions)
      .status(200)
      .json({ message: "Success" });
  });

  router.get("/me", async (req, res) => {
    let { token } = req.cookies;
    const userId = await sessions.findUserId(db, token);
    if (isEmpty(token) || isEmpty(userId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    return res.status(200).json({ userId });
  });

  return router;
}
