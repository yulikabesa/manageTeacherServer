import {
  bigint,
  varchar,
  datetime2,
  check,
  primaryKey,
  mssqlTable,
} from "drizzle-orm/mssql-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const userRoles = mssqlTable(
  "user_roles",
  {
    user_id: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.user_id),
    roleCode: varchar("role_code", { length: 20 }).notNull(),
    assignedBy: bigint("assigned_by", { mode: "number" }).references(
      () => users.user_id,
    ),
    assignedAtUtc: datetime2("assigned_at_utc", { precision: 0 })
      .notNull()
      .default(sql`SYSUTCDATETIME()`),
  },
  (table) => [
    // Composite key (user + role) can only be declared at table level
    primaryKey({ columns: [table.user_id, table.roleCode] }),

    check(
      "user_roles_role_code_check",
      sql`${table.roleCode} IN ('STAFF', 'TEACHER', 'COMMANDER', 'SYSTEM_ADMIN')`,
    ),
  ],
);
