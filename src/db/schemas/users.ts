import { sql } from "drizzle-orm";
import {
  mssqlTable,
  bigint,
  nvarchar,
  varchar,
  bit,
  datetime2,
  check,
} from "drizzle-orm/mssql-core";

export const users = mssqlTable(
  "Users",
  {
    user_id: bigint("user_id", { mode: "number" }).primaryKey().identity(),
    username: nvarchar("username", { length: 80 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    full_name: nvarchar("full_name", { length: 150 }).notNull(),
    personal_number: varchar("personal_number", { length: 7 }).notNull().unique(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 25 }).notNull(),
    position_title: nvarchar("position_title", { length: 120 }).notNull(),
    rank: nvarchar("rank", { length: 50 }).notNull(),
    service_type: varchar("service_type", { length: 20 }).notNull(),
    is_active: bit("is_active").notNull(),
    created_at_utc: datetime2("created_at_utc", { precision: 0 }).notNull(),
    updated_at_utc: datetime2("updated_at_utc", { precision: 0 }).notNull(),
  },
  (table) => [
    check(
      "users_service_type_check",
      sql`${table.service_type} IN ('Mandatory', 'Career')`,
    ),

    check(
      "users_phone_check",
      sql`${table.phone} NOT LIKE '%[^0-9]%'
          AND LEN(${table.phone}) = 10`,
    ),

    check("users_email_check", sql`${table.email} LIKE '%_@_%._%'`),
  ],
);
