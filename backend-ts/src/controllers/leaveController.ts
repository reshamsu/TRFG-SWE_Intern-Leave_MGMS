import { Request, Response } from "express";
import * as leaveService from "../services/leaveService.ts"; // 💡 Fixed: Changed extension to .js
import { NextFunction } from "express-serve-static-core";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export class LeaveController {
  // private leaveService = new LeaveService();

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

      console.log("DEBUG PAYLOAD:", {
        employeeId,
        bodyReceived: req.body,
        userObject: req.user,
        parsed: { startDate, endDate, reason },
      });

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

      const newRequest = await leaveService.createLeave({
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

  getHistory = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response | void> => {
    try {
      const employee_id = req.user?.id;

      if (!employee_id) {
        return res.status(400).json({
          error: "Employee_id query paramter is required",
        });
      }

      const history = await leaveService.getLeaveHistory(employee_id);

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

      const cancelLeave = await leaveService.cancelRequest({
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

  // changeLeave = async (
  //   req: AuthenticatedRequest,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<Response | void> => {
  //   try {
  //     const id = parseInt(req.params.id as string, 10);
  //     const employeeId = req.user!.id;

  //     if (isNaN(id) || isNaN(employeeId)) {
  //       return res.status(400).json({
  //         error:
  //           "Invalid or missing parameters. Leave ID and employee parameters must be valid",
  //       });
  //     }

  //     const changeLeave = await leaveService.changeRequest({
  //       id,
  //       employeeId,
  //     });

  //     return res.status(200).json({
  //       message: "Leave request successfully changed by employee",
  //       data: changeLeave,
  //     });
  //   } catch (error: any) {
  //     if (error.message === "Leave request not found or unauthorized") {
  //       return res.status(404).json({ error: error.message });
  //     }

  //     if (error.message.includes("Cannot change a leave request")) {
  //       return res.status(400).json({ error: error.message });
  //     }
  //     next(error);
  //   }
  // };
}
