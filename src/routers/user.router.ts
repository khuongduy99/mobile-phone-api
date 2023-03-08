import express, { Request, Response } from "express";
import * as UserController from "../controllers/user.controller";

export const userRouter = express.Router();
import { isAuth } from "../middlewares/auth.middlewares";

userRouter.get("/", isAuth(["user_role"]), UserController.findAll);
userRouter.post("/", UserController.create);
