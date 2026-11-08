import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../db/db";
import { users } from "../db/schemas/users";
import bcrypt from "bcryptjs";

export class UserController {
  // POST create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);
      const now = new Date();

      await db.insert(users).values({
        username: userData.username,
        password_hash: passwordHash,
        full_name: userData.full_name,
        personal_number: userData.personal_number,
        email: userData.email,
        phone: userData.phone,
        position_title: userData.position_title,
        rank: userData.rank,
        service_type: userData.service_type,
        is_active: true,
        created_at_utc: now,
        updated_at_utc: now,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to create a user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
