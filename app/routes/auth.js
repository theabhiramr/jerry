import express from "express";
import cookieParser from "cookie-parser";
import argon2 from "argon2";
import crypto from "crypto";
import { create, findByUsername } from "../model/users.js";

function createAuth({ db, options }) {
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
    if (!body.hasOwnProperty("username") || !body.hasOwnProperty("password") || !body.hasOwnProperty("email")) {
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

    let { username, password } = req.body;

    let result;
    try {
      result = await findByUsername(req.app.locals.db, username);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ error: "Invalid username/password" });
    }

    let passwordHash;
    try {
      passwrordHash = await argon2.hash(password);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }

    try {
      result = await create(db, { username, email, passwordhash });
    }
  });

  router.post("/login", (req, res) => {});
}
