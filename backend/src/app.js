import express from "express";
import cors from "cors";
import {
  handleRegister,
  handleLogin,
  // handleAuthMe,
} from "./routes/authRoutes.js";
// import pool from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/auth/login", handleLogin);
app.post("/api/auth/register", handleRegister);

// app.get("/api/auth/me", handleAuthMe);

// TEST RUNTIME
// app.get("/api/leave", (req, res) => {
//   res.json({
//     success: true,
//     message: "Leave Management API is running",
//   });
// });

// DB TEST ACTIVE
// app.get("/api/db-test", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");

//     res.json({
//       success: true,
//       databaseTime: result.rows[0],
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//     });
//   }
// });

export default app;
