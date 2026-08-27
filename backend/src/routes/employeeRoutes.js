import express from "express";
import {
  createLeaveRequest,
  getMyLeaveRequest,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/leaves", createLeaveRequest);
router.get("/leaves/my", getMyLeaveRequest); // my?employee_id=2

export default router;
