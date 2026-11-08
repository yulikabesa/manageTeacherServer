import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  dialect: "mssql",
  dbCredentials: {
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
});
