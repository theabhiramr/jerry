const express = require("express");

const hostname = "localhost";
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
