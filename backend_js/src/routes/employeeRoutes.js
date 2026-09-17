import express from "express";
import {
  handleCancelMyLeave,
  handleGetMyLeave,
  handleCreateLeave,
  handleChangeMyLeave,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/leaves", handleCreateLeave);
router.get("/leaves/my", handleGetMyLeave); // my?employee_id=2
router.put("/leaves/:id/cancel", handleCancelMyLeave); 
router.put("/leaves/:id/change", handleChangeMyLeave);

export default router;
