import express from "express";
import {
  handleGETAllLeaves,
  handleApproveLeave,
  handleRejectLeave,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/leaves", handleGETAllLeaves);
router.put("/leaves/:id/approve", handleApproveLeave);
router.put("/leaves/:id/reject", handleRejectLeave);

export default router;
