import express from "express";
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/auth.router";
import { createConnection } from "./database";
import { brandRouter } from "./routers/brand.router";
import { productRouter } from "./routers/product.router";

require("dotenv").config();

createConnection();
const app = express();
const PORT: number = parseInt("7000");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/brands/", brandRouter);
app.use("/api/products/", productRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
