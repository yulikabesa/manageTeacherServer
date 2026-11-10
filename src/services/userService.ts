// src/services/userService.ts
import bcrypt from "bcryptjs";
import { db } from "../db/db";
import { users } from "../db/schemas/users";
import { userRoles } from "../db/schemas/userRoles";
import { teacherApplications } from "../db/schemas/teacherApplications";

type CreateUserInput = {
  username: string;
  password: string;
  full_name: string;
  personal_number: string;
  email: string;
  phone: string;
  position_title: string;
  rank: string;
  service_type: string;
  wants_teacher: boolean;
};

export class UserService {
  static async createUser(reqBody: CreateUserInput) {
    const { password, wants_teacher, ...userFields } = reqBody;
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    return db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .output({ user_id: users.user_id }) 
        .values({
          ...userFields,
          password_hash: passwordHash,
          is_active: true,
          created_at_utc: now,
          updated_at_utc: now,
        });

      // Every user starts as STAFF - סגל
      await tx.insert(userRoles).values({ user_id: user.user_id, roleCode: "STAFF" });
      
      if (wants_teacher) {
        await tx.insert(teacherApplications).values({ user_id: user.user_id });
      }
      return user.user_id;
    });
  }
}
