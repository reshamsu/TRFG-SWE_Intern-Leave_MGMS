import { Router } from "express";
import { AdminController } from "../controllers/adminController.ts";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middleware/authMiddleware.ts";

const router = Router();
const adminController = new AdminController();

router.post("/register", adminController.registerUser);

// Leave Requests Routes
router.get("/leaves", authenticateUser, authorizeAdmin, (req, res, next) =>
  adminController.getAllLeaves(req, res, next),
);
router.patch(
  "/leaves/:id/approve",
  authenticateUser,
  authorizeAdmin,
  (req, res, next) => adminController.approveRequest(req, res, next),
);
router.patch(
  "/leaves/:id/reject",
  authenticateUser,
  authorizeAdmin,
  (req, res, next) => adminController.rejectRequest(req, res, next),
);

// User Via Admin Routes
router.get("/users", authenticateUser, authorizeAdmin, (req, res, next) =>
  adminController.getAllUsers(req, res, next),
);
router.patch(
  "/user/:id/approve",
  authenticateUser,
  authorizeAdmin,
  (req, res, next) => adminController.approveUser(req, res, next),
);
router.patch(
  "/user/:id/reject",
  authenticateUser,
  authorizeAdmin,
  (req, res, next) => adminController.rejectUser(req, res, next),
);

export default router;
