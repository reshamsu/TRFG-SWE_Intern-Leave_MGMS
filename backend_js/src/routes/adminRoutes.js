import express from "express";
import {
  handleGETAllUsers,
  handleGETAllLeaves,
  handleApproveUser,
  handleRejectUser,
  handleApproveLeave,
  handleRejectLeave,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", handleGETAllUsers);
router.get("/leaves", handleGETAllLeaves);
router.put("/users/:id/approve", handleApproveUser);
router.put("/users/:id/reject", handleRejectUser);
router.put("/leaves/:id/approve", handleApproveLeave);
router.put("/leaves/:id/reject", handleRejectLeave);

export default router;
