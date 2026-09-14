import { Request, Response, NextFunction } from "express-serve-static-core";
import { AdminService } from "../services/adminService.ts";
import { Status } from "../entities/leaveEntity.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export class AdminController {
  private adminService = new AdminService();

  getAllLeaves = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const leaves = await this.adminService.fetchAllLeaves();
      return res.status(200).json(leaves);
    } catch (error) {
      next(error);
    }
  };

    registerUser = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | void> => {
      try {
        const { name, email } = req.body;
  
        if (!name || !email) {
          return res.status(400).json({ error: "All fields are required" });
        }
  
        const newUser = await this.adminService.registerUser(req.body);
  
        const { password, ...safeUser } = newUser;
  
        return res.status(201).json({
          message: "User registered successfully",
          data: safeUser,
        });
      } catch (error: any) {
        return res.status(409).json({
          error: "Eamil is already registered.",
        });
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

      const updateLeave = await this.adminService.updateLeaveStatus(
        id,
        adminId,
        Status.APPROVED,
      );

      return res.status(200).json({
        message: "Leave request approved successfully",
        data: updateLeave,
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
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
          message: "A rejection reason is required.",
        });
      }

      const updateLeave = await this.adminService.updateLeaveStatus(
        id,
        adminId,
        Status.REJECTED,
        rejection_reason,
      );
      return res.status(200).json({
        message: "Leave request rejected successfully",
        data: updateLeave,
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        return res.status(404).json({
          error: error.message,
        });
      }
      next(error);
    }
  };

  getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const users = await this.adminService.fetchAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  approveUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const adminId = req.user!.id;

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. User ID parameter must be valid.",
        });
      }

      const updateUser = await this.adminService.updateUserStatus(
        id,
        adminId,
        Status.APPROVED,
      );

      return res.status(200).json({
        message: "User approved successfully",
        data: updateUser,
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        return res.status(404).json({
          error: error.message,
        });
      }
      next(error);
    }
  };

  rejectUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const adminId = req.user!.id;

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. User ID parameter must be valid.",
        });
      }

      const updateUser = await this.adminService.updateUserStatus(
        id,
        adminId,
        Status.REJECTED,
      );

      return res.status(200).json({
        message: "User rejected successfully",
        data: updateUser,
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        return res.status(404).json({
          error: error.message,
        });
      }
      next(error);
    }
  };
}
