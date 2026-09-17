import { Router } from "express";
import { LeaveController } from "../controllers/leaveController.ts";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.ts";

const router = Router();
const leaveController = new LeaveController();

// --- Employee Leave Routes ---
router.post("/apply", authenticateUser, leaveController.applyLeave);
router.get("/my", authenticateUser, leaveController.getHistory);
router.patch("/:id/cancel", authenticateUser, leaveController.cancelLeave);

// --- Admin Leave Management Routes ---
router.get("/all", authenticateUser, authorizeAdmin, leaveController.getAllLeaves);
router.patch("/:id/approve", authenticateUser, authorizeAdmin, leaveController.approveRequest);
router.patch("/:id/reject", authenticateUser, authorizeAdmin, leaveController.rejectRequest);

export default router;
