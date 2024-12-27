import { Hono } from "@hono";
import type { Context } from "@hono";
function main(): void {
  const app = new Hono();
  Deno.serve(app.fetch);
}

if (import.meta.main) {
  main();
}
