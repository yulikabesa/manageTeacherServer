import sql from "mssql";
import { drizzle } from "drizzle-orm/node-mssql";
// import { users } from "./schemas/users.ts";

// SQL Server configuration
const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 1433),

  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Create connection pool
export const pool = new sql.ConnectionPool(config);

// Connection promise
export const poolConnection = pool.connect();

// Initialize Drizzle
export const db = drizzle({ client: pool });

// TEST
// export const testDbConnection = async () => {
//   const result = await db
//     .select()
//     .from(users);

//   console.log("Users retrieved successfully!");
//   console.log(result);
// };
