import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/schemas/users";

const unauthorized = (res: Response, message = "Please authenticate") => {
  res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message });
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    unauthorized(res);
    return;
  }

  let userId: number;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    userId = typeof decoded === "object" ? Number(decoded.userId) : NaN;
    if (!Number.isInteger(userId)) {
      unauthorized(res);
      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      unauthorized(res, "Session expired, please log in again");
      return;
    }
    unauthorized(res);
    return;
  }

  try {
    const [user] = await db
      .select()
      .top(1)
      .from(users)
      .where(eq(users.user_id, userId));

    // User deleted or disabled after the token was issued
    if (!user || !user.is_active) {
      unauthorized(res);
      return;
    }

    const { password_hash, ...safeUser } = user;
    req.user = safeUser;
    req.token = token;

    next();
  } catch (error) {
    console.error("Auth middleware failed:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Authentication failed" });
  }
};
