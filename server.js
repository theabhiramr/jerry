const fs = require("fs");
const path = require("path");
const express = require("express");

const hostname = "localhost";
const port = 3000;
const app = express();

const dependencies = {
  marked: "marked.esm.js",
  dedent: "dedent.mjs",
};

const importMap = { imports: {} };
for (const [name, file] of Object.entries(dependencies)) {
  const dir = path.dirname(require.resolve(name));
  if (!fs.existsSync(path.join(dir, file))) {
    throw new Error(`vendor ${name}: ${file} not found in ${dir}`);
  }
  app.use(`/vendor/${name}`, express.static(dir));
  importMap.imports[name] = `/vendor/${name}/${file}`;
}

const importMapTag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/{*splat}", async (req, res, next) => {
  if (path.extname(req.path)) return next();
  const html = await fs.promises.readFile(
    path.join(path.join(__dirname, "public"), "index.html"),
    "utf8",
  );
  res.type("html").send(html.replace("<!-- importmap -->", importMapTag));
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
