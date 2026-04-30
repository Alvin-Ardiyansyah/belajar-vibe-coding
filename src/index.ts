import { Elysia } from "elysia";
import { db, users } from "./db";

const app = new Elysia()
  .get("/", () => "Hello World")
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (error) {
      return { error: "Database connection failed or table not found" };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
