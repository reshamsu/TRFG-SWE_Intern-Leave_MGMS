import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import {
  createUser,
  fetchAllUsers,
  updateUser,
  softDeleteUser,
  getMyUser,
} from "../services/userService.ts";

export class UserController {
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

      const newUser = await createUser(req.body);

      // Exclude password safely before returning payload
      const { password, ...safeUser } = newUser;

      return res.status(201).json({
        message: "User registered successfully",
        data: safeUser,
      });
    } catch (error: any) {
      return res.status(409).json({
        error: "Email is already registered.",
      });
    }
  };

  getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const users = await fetchAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getMyUser = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response | void> => {
    try {
      const id = req.user?.id;

      if (!id) {
        return res.status(400).json({
          error: "Current ID is required",
        });
      }

      const current = await getMyUser(id);

      return res.status(200).json({
        message: "Current User retrieved successfully",
        count: current.length,
        current,
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  editUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. User ID parameter must be valid.",
        });
      }

      const { name, email, password } = req.body;
      const userData = {
        name,
        email,
        password,
        updated_at: new Date(),
      };

      const updateUserResult = await updateUser(id, userData);

      return res.status(200).json({
        message: "Profile edited successfully",
        data: updateUserResult,
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

  deleteUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid parameters. User ID parameter must be valid.",
        });
      }

      const deleteUser = await softDeleteUser(id);

      return res.status(200).json({
        message: "User successfully soft-deleted.",
        data: {
          id: deleteUser.id,
          name: deleteUser.name,
          email: deleteUser.email,
          // user.deleted_at is now populated, proving it is deleted
          deleted_at: deleteUser.deleted_at,
        },
      });
    } catch (error: any) {
      next(error);
    }
  };
}
