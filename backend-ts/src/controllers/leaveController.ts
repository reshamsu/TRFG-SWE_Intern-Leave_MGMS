import { Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import {
  createLeave,
  getLeaveHistory,
  cancelRequest,
  fetchAllLeaves,
  updateLeaveStatus,
} from "../services/leaveService.ts";
import { LeaveStatus } from "../entities/leaveEntity.ts";

export class LeaveController {

  getAllLeaves = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const leaves = await fetchAllLeaves();
      return res.status(200).json(leaves);
    } catch (error) {
      next(error);
    }
  };

  reviewLeave = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const adminId = req.user?.id;
      const { status, rejection_reason: rejectionReason } = req.body ?? {};

      if (isNaN(id) || !adminId || !status) {
        return res.status(400).json({
          error: "Valid Leave ID, Status, and Admin context are required",
        });
      }

      const updatedLeave = await updateLeaveStatus({
        id,
        adminId,
        status,
        rejectionReason,
      });

      return res.status(200).json({
        message: "Leave request status updated successfully",
        data: updatedLeave,
      });
    } catch (error: any) {
      if (error.statusCode === 404 || error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Can only update status")) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  };

  // --- EMPLOYEE CONTROLLERS ---

  applyLeave = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response | void> => {
    try {
      const employeeId = req.user?.id;
      const {
        start_date: startDate,
        end_date: endDate,
        reason,
      } = req.body ?? {};

      if (!employeeId || !startDate || !endDate || !reason) {
        res.status(400).json({
          error: "EmployeeId, StartDate, EndDate, Reason are required",
        });
        return;
      }

      if (new Date(endDate) < new Date(startDate)) {
        return res
          .status(400)
          .json({ error: "End date cannot be before start date" });
      }

      const newRequest = await createLeave({
        employeeId: Number(employeeId),
        startDate,
        endDate,
        reason,
      });

      res.status(201).json({
        message: "Leave request submitted successfully",
        data: newRequest,
      });
      return;
    } catch (error: any) {
      console.error("Failed to create leave request", error);

      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: "Server Error, Could not create leave request",
      });
      return;
    }
  };

  approveRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const adminId = req.user!.id;

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. Leave ID parameter must be valid.",
        });
      }

      const updateLeave = await updateLeaveStatus({
        id,
        adminId,
        status: LeaveStatus.APPROVED,
      });

      return res.status(200).json({
        message: "Leave request approved successfully",
        data: updateLeave,
      });
    } catch (error: any) {
      if (error.statusCode === 404 || error.message.includes("not found")) {
        return res.status(404).json({
          error: error.message,
        });
      }
      next(error);
    }
  };

  rejectRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { rejection_reason } = req.body;
      const adminId = req.user!.id;

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. Leave ID parameter must be valid.",
        });
      }

      if (!rejection_reason) {
        return res.status(400).json({
          error: "A rejection reason is required.",
        });
      }

      // Routed properly to leaveService function
      const updateLeave = await updateLeaveStatus({
        id,
        adminId,
        status: LeaveStatus.REJECTED,
        rejectionReason: rejection_reason,
      });

      return res.status(200).json({
        message: "Leave request rejected successfully",
        data: updateLeave,
      });
    } catch (error: any) {
      if (error.statusCode === 404 || error.message.includes("not found")) {
        return res.status(404).json({
          error: error.message,
        });
      }
      next(error);
    }
  };

  getHistory = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response | void> => {
    try {
      const employee_id = req.user?.id;

      if (!employee_id) {
        return res.status(400).json({
          error: "Employee context is required",
        });
      }

      const history = await getLeaveHistory(employee_id);

      return res.status(200).json({
        message: "Leave history retrieved successfully",
        count: history.length,
        history,
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  cancelLeave = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const employeeId = req.user!.id;

      if (isNaN(id) || isNaN(employeeId)) {
        return res.status(400).json({
          error:
            "Invalid or missing parameters. Leave ID and employee parameters must be valid",
        });
      }

      const cancelLeave = await cancelRequest({
        id,
        employeeId,
      });

      return res.status(200).json({
        message: "Leave request successfully cancelled by employee",
        data: cancelLeave,
      });
    } catch (error: any) {
      if (error.message === "Leave request not found or unauthorized") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message.includes("Cannot cancel a leave request")) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  };
}
