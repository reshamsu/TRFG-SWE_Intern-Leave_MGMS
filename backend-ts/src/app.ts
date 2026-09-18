import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import leaveRoutes from "./routes/leaveRoutes.ts";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public authentication routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/leaves", leaveRoutes);

// app.use("/api/admin", adminRoutes);

export default app;
