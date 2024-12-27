import type { Context } from "@hono";
import { getCookie, setCookie } from "@hono/cookie";

import mongoose from "npm:mongoose";

// @ts-types="@types/bcrypt"
import bcrypt from "npm:bcrypt";
// @ts-types="@types/jwt"
import jwt from "npm:jsonwebtoken";

import { User } from "./schemas.ts";

import {
  JwtPayloadType,
  SignUpPayloadType,
  UserType,
} from "./types.ts";
import { hashPassword } from "./utils.ts";
/**
 * Middleware that opens MongoDB Atlas connection using mongoose ODM.
 *
 * @example
 * ```
 * app.get("*",dbConnect,(c:Context)=>{...})

 * ```
 */
export const dbConnect = (c: Context, next: () => Promise<void>) => {
  const username = Deno.env.get("MONGO_ATLAS_USERNAME");
  const password = Deno.env.get("MONGO_ATLAS_PASSWORD");

  if (!username) return c.json({ message: "Missing Atlas username" }, 500);
  if (!password) return c.json({ message: "Missing Atlas password" }, 500);

  try {
    const uri = `mongodb+srv://${username}:${password}@strideify.xoq40.mongodb.net/?retryWrites=true&w=majority&appName=Strideify`;
    // @ts-ignore Issues with mongoose in deno cause it to not see .connect() as a method
    mongoose.connect(uri);
  } catch {
    return c.json({ message: "Failed to connect to Atlas" }, 500);
  }

  return next();
};

/**
 * Middleware that creates a new User document (if given username does not exist) using mongoose ODM.
 * 
 * Issues JWT cookie if successful.
 *
 * @example
 * ```
 * app.post("/signup",...,createUserIfNotExist,(c:Context)=>{...})

 * ```
 */
export const createUserIfNotExist = async (
  c: Context,
  next: () => Promise<void>
) => {
  const { username, password }: SignUpPayloadType = await c.req.json();

  // CHECK IF USER EXISTS
  const user: UserType | null | undefined = await User.findOne({
    username,
  });
  if (user)
    return c.json({ message: "User already exists with this username" }, 401);

  // HASH PASSWORD
  const hashedPassword = await hashPassword(password);

  const payload = { username, password: hashedPassword };
  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) return c.json({ message: "Token secret missing" }, 500);
  const expiresIn = Deno.env.get("JWT_EXPIRES_IN");

  const token = jwt.sign(payload, secret, { expiresIn });
  const newUser = new User({ username, token });
  await newUser.save();

  setCookie(c, "jwt", token);

  return next();
};
