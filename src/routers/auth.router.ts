import express, { Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
import { isAuth } from "../middlewares/auth.middlewares";

export const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
authRouter.get("/profile", isAuth(["admin_role"]), AuthController.profile);
authRouter.post("/refresh-token", AuthController.refreshToken);
