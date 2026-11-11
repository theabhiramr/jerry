import express from "express";

export function createApp({ db, options }) {
  const app = express();
  return app;
}
