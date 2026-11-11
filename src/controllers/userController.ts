import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../db/db";
import { users } from "../db/schemas/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, like, or } from "drizzle-orm";
import { UserService } from "../services/userService";

const TOKEN_EXPIRES_IN = "1d";
const TOKEN_COOKIE_NAME = "token";
const GET_LIMIT = 20;

const tokenCookieOptions = {
  httpOnly: false, // Not httpOnly: the frontend reads it and sends it as "Authorization: Bearer ..."
  secure: false, // Set to true if we'll use HTTPS
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export class UserController {
  // POST create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      await UserService.createUser({
        username: userData.username,
        password: userData.password,
        full_name: userData.full_name,
        personal_number: userData.personal_number,
        email: userData.email,
        phone: userData.phone,
        position_title: userData.position_title,
        rank: userData.rank,
        service_type: userData.service_type,
        wants_teacher: userData.wants_teacher === true,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error: any) {
      const message = error.cause?.message ?? error.message ?? "";

      if (message.includes("Violation of UNIQUE")) {
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: "A user with these details already exists.",
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to create a user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST login user, returns a JWT
  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body ?? {};

      if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username ||
        !password
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Username and password are required.",
        });
        return;
      }

      const [user] = await db
        .select()
        .top(1)
        .from(users)
        .where(eq(users.username, username.trim()));

      const passwordMatches = await bcrypt.compare(
        password,
        user?.password_hash ?? "",
      );

      // Same response for unknown username and wrong password
      if (!user || !passwordMatches) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Invalid username or password.",
        });
        return;
      }

      if (!user.is_active) {
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "This account is disabled.",
        });
        return;
      }

      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: TOKEN_EXPIRES_IN },
      );

      // safe user is the user without the password
      const { password_hash, ...safeUser } = user;

      res.cookie(TOKEN_COOKIE_NAME, token, tokenCookieOptions);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: safeUser,
      });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to log in",
      });
    }
  }

  // POST logoutUser clears the cookie
  static async logoutUser(req: Request, res: Response): Promise<void> {
    // Options must match the ones used when setting it, or the browser keeps it
    const { maxAge, ...clearOptions } = tokenCookieOptions;
    res.clearCookie(TOKEN_COOKIE_NAME, clearOptions);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  // GET the logged in user
  // The auth middleware already loaded a fresh copy from the DB (without the password hash)
  static async getUser(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ success: true, user: req.user });
  }

  // GET users
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

      // Return empty array or all users (paginated) if no search term is provided
      if (!query) {
        res.status(StatusCodes.OK).json({
          success: true,
          users: [],
          message: "no term was provided",
        });
        return;
      }

      const searchPattern = `%${query}%`;

      const matchedUsers = await db
        .select({
          id: users.user_id,
          username: users.username,
          email: users.email,
        })
        .from(users)
        .where(
          or(
            like(users.username, searchPattern),
            like(users.email, searchPattern),
          ),
        )
        .orderBy(users.username)
        .offset(0)
        .fetch(GET_LIMIT);

      res.json(matchedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET user by user id
  // TODO
  static async getUserById(req: Request, res: Response): Promise<void> {}

  // UPDATE the user's password
  // TODO
  static async updateUserPassword(req: Request, res: Response): Promise<void> {}

  // UPDATE user's details
  // TODO
  static async updateUser(req: Request, res: Response): Promise<void> {}

  // PUT make a user a commander
  // TODO
  static async createCommander(req: Request, res: Response): Promise<void> {}
}
