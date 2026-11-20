import express from "express";
import fs from "fs";
import path from "path";
import { apiRouter } from "./routes/api.js";

// const require = createRequire(import.meta.url);
// const publicDir = path.join(import.meta.dirname, "..", "public");
//
// const dependencies = {
//   marked: "marked.esm.js",
//   dedent: "dedent.mjs",
// };

export function createApp({ pool }) {
  const app = express();
  app.use("/api", apiRouter({ pool }));

  // const importMap = { imports: {} };
  // for (const [name, file] of Object.entries(dependencies)) {
  //   const dir = path.dirname(require.resolve(name));
  //   if (!fs.existsSync(path.join(dir, file))) {
  //     throw new Error(`vendor ${name}: ${file} not found in ${dir}`);
  //   }
  //   app.use(`/vendor/${name}`, express.static(dir));
  //   importMap.imports[name] = `/vendor/${name}/${file}`;
  // }
  // const importMapTag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

  // app.use(express.static(publicDir, { index: false }));

  // app.get("/{*splat}", async (req, res, next) => {
  //   if (path.extname(req.path)) return next();
  //   const html = await fs.promises.readFile(
  //     path.join(publicDir, "index.html"),
  //     "utf8",
  //   );
  //   res.type("html").send(html.replace("<!-- importmap -->", importMapTag));
  // });

  return app;
}
