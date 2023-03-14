import express, { Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
import ProductController from "../controllers/product.controller";
import { isAuth } from "../middlewares/auth.middlewares";

export const productRouter = express.Router();

productRouter.get("/", ProductController.getItems);
productRouter.get("/:id", ProductController.getItemById);
productRouter.post("/", ProductController.create);
