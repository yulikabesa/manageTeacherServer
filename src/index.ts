import express from "express";
import "dotenv/config";
import userRouter from "./routers/userRoutes.ts";
import cors from "cors";
import http from "http";
import cookieParser from 'cookie-parser';
import { poolConnection } from "./db/db.ts";

const app = express();

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // lets the browser accept the token cookie from cross-origin requests
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRouter);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await poolConnection;
    console.log("Connected to SQL Server!");

    server.listen(port, () => {
      console.log("Server is up on port " + port);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
