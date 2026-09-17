import { Router } from "express";
import { UserController } from "../controllers/userController.ts";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middleware/authMiddleware.ts";

const router = Router();
const userController = new UserController();

router.post(
  "/register",
  authenticateUser,
  authorizeAdmin,
  userController.registerUser,
);
router.get(
  "/all",
  authenticateUser,
  authorizeAdmin,
  userController.getAllUsers,
);

router.get("/my", authenticateUser, userController.getMyUser);
router.patch("/:id/edit", authenticateUser, userController.editUser);
router.patch(
  "/:id/delete",
  authenticateUser,
  authorizeAdmin,
  userController.deleteUser,
);

export default router;
