import express from "express";
import cookieParser from "cookie-parser";
import argon2 from "argon2";
import crypto from "crypto";
import Pool from "pg-pool";
import { create, findByUsername } from "../model/users.js";

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
  if (!body.hasOwnProperty("username") || !body.hasOwnProperty("password")) {
    return false;
  }
  let { username, password } = body;
  return (
    typeof username === "string" &&
    typeof password === "string" &&
    username.length >= 1 &&
    username.length <= 25 &&
    password.length >= 8 &&
    password.length <= 100
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
    result = await 
  }

router.post("/login", (req, res) => {});
