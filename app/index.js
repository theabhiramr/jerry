import express from "express";

export const app = express();
const port = 8080;

app.listen(port, () => {
  console.log("backend starting on http://localhost:8080");
});
