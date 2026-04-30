import { Elysia } from "elysia";
import { db, users } from "./db";
import { usersRoute } from "./routers/users-route";

const app = new Elysia()
  .get("/", () => "Hello World")
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (error) {
      return { error: "Database connection failed or table not found" };
    }
  })
  .use(usersRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
