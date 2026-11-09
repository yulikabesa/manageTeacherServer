import type { users } from "../db/schemas/users";

// The logged-in user, as attached by the auth middleware (no password hash)
export type AuthUser = Omit<typeof users.$inferSelect, "password_hash">;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
    }
  }
}
