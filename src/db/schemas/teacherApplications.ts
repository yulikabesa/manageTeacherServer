import {
  bigint,
  varchar,
  datetime2,
  check,
  mssqlTable,
  nvarchar,
} from "drizzle-orm/mssql-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const teacherApplications = mssqlTable(
  "teacher_applications",
  {
    application_id: bigint("application_id", { mode: "number" })
      .primaryKey()
      .identity(),
    user_id: bigint("user_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => users.user_id),
    status: varchar("status", { length: 20 }).notNull().default("PENDING"),
    requested_at_utc: datetime2("requested_at_utc", { precision: 0 })
      .notNull()
      .default(sql`SYSUTCDATETIME()`),
    reviewed_by: bigint("reviewed_by", { mode: "number" }).references(
      () => users.user_id,
    ),
    reviewed_at_utc: datetime2("reviewed_at_utc", { precision: 0 }),
    review_notes: nvarchar("review_notes", { length: 1000 }),
  },
  (table) => [
    check(
      "teacher_applications_status_check",
      sql`${table.status} IN ('PENDING', 'APPROVED', 'REJECTED')`,
    ),

    check(
      "teacher_applications_review_check",
      sql`
        (
          ${table.status} = 'PENDING'
          AND ${table.reviewed_by} IS NULL
          AND ${table.reviewed_at_utc} IS NULL
        )
        OR
        (
          ${table.status} IN ('APPROVED', 'REJECTED')
          AND ${table.reviewed_by} IS NOT NULL
          AND ${table.reviewed_at_utc} IS NOT NULL
        )
      `,
    ),
  ],
);
