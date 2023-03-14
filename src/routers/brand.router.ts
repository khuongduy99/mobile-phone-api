import express, { Request, Response } from "express";
import BrandController from "../controllers/brand.controller";
import { isAuth } from "../middlewares/auth.middlewares";

export const brandRouter = express.Router();

brandRouter.post("/", isAuth(["admin_role"]), BrandController.create);
brandRouter.get("/", BrandController.findAll);
