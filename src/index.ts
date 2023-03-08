import express from "express";
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/auth.router";
import { createConnection } from "./database";

require("dotenv").config();

createConnection();
const app = express();
const PORT: number = parseInt("7000");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
