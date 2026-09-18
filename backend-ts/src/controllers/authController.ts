import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/authService.ts";

export class AuthController {
  private authService = new AuthService();

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required!",
        });
      }

      const result = await this.authService.loginUser({ email, password });

      return res.status(200).json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
      next(error);
    }
  };
}
