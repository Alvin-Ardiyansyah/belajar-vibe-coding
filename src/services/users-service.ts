import { db, users } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async ({ name, email, password }: any) => {
  // 1. Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // 2. Hash password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert new user into database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true };
};
