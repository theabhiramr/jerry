// db related middleware

/**
 * @param {import("pg").Pool} pool
 * @return {import("express").RequestHandler}
 */
export function database(pool) {
  return async (req, res, next) => {
    const client = await pool.connect();

    req.db = client;

    req.tx = async (fn) => {
      try {
        await client.query("BEGIN");
        const result = await fn(client);
        await client.query("COMMIT");
        return result;
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    };

    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        client.release();
      }
    };

    res.on("finish", release);
    res.on("close", release);

    next();
  };
}
