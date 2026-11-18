import express from "express";
import argon2 from "argon2";
import crypto from "crypto";
import { create, findByUsername, getPasswordHash } from "../model/users.js";

export function authRouter({ db, options }) {
  console.log("setting up auther router");
  const router = express.Router();

  const WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;
  let cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: WEEK_IN_MS,
  };

  let tokens = {};

  function validLoginBody(body) {
    if (
      !body.hasOwnProperty("username") ||
      !body.hasOwnProperty("password") ||
      !body.hasOwnProperty("email")
    ) {
      return false;
    }
    let { username, email, password } = body;
    return (
      typeof username === "string" &&
      typeof password === "string" &&
      typeof email === "string" &&
      username.length >= 1 &&
      username.length <= 25 &&
      password.length >= 8 &&
      password.length <= 100 &&
      email.length >= 5 &&
      email.length <= 100 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }

    let passwordHash = result.rows[0].hash;
    let validPassword;
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

    let token = generateToken(); // TODO: store token in session table
    tokens[token] = result.rows[0].id;
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ message: "Success" });
  });

  router.post("/logout", (req, res) => {
    let { token } = req.cookies;
    if (token !== undefined) {
      delete tokens[token];
    }
    return res
      .clearCookie("token", cookieOptions)
      .status(200)
      .json({ message: "Success" });
  });

  router.get("/me", (req, res) => {
    let { token } = req.cookies;
    if (token === undefined || !tokens.hasOwnProperty(token)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    return res.status(200).json({ userId: tokens[token] });
  });

  return router;
}
