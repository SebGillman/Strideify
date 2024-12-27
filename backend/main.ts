import { Hono } from "@hono";
import type { Context } from "@hono";

import "@std/dotenv/load";
import {
  checkCredentials,
  createUserIfNotExist,
  dbConnect,
} from "./middleware.ts";

function main(): void {
  const app = new Hono();

  app.post("/signup", dbConnect, createUserIfNotExist, (c: Context) =>
    c.json({ message: "success" })
  );

  app.post("/login", dbConnect, checkCredentials, (c: Context) =>
    c.json({ message: "success" })
  );
  Deno.serve(app.fetch);
}

if (import.meta.main) {
  main();
}
