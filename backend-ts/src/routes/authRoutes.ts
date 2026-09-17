import { Router } from "express";
import { AuthController } from "../controllers/authController.ts";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login)

export default router;