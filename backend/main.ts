import { Hono } from "@hono";
import { cors } from "@hono/cors";
import type { Context } from "@hono";

import "@std/dotenv/load";
import {
  authenticateToken,
  checkCredentials,
  createUserIfNotExist,
  dbConnect,
} from "./middleware.ts";

function main(): void {
  const app = new Hono();

  app.use("*", cors());

  app.post("/signup", dbConnect, createUserIfNotExist, (c: Context) =>
    c.json({ message: "success" })
  );

  app.post("/login", dbConnect, checkCredentials, (c: Context) =>
    c.json({ message: "success" })
  );

  app.get("/check-logged-in", dbConnect, authenticateToken, (c: Context) => {
    return c.json({ message: "success" });
  });

  Deno.serve(app.fetch);
}

if (import.meta.main) {
  main();
}
