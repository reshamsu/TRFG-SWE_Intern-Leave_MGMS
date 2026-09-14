import { Router } from "express";
import { LeaveController } from "../controllers/leaveController.ts";
import { authenticateUser } from "../middleware/authMiddleware.ts";

const router = Router();
const leaveController = new LeaveController();

router.post("/apply", authenticateUser, leaveController.applyLeave);
router.get("/my", authenticateUser, leaveController.getHistory);
router.patch("/:id/cancel", authenticateUser, leaveController.cancelLeave);
// router.patch("/:id/change", authenticateUser, leaveController.changeLeave);

export default router;
