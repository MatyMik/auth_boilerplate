import { Router } from "express";
import { AuthController } from "../controller/authController";
import { validateSignup } from "../middlewares/validate";

const router = Router();

const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", validateSignup, authController.register);

export default router;
