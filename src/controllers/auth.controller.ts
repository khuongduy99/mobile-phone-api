import { Handler } from "express";
import { nanoid } from "nanoid";
import { getConnection } from "../database";
import { Request, Response } from "express";
import * as randToken from "rand-token";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../interfaces/user.interface";

class AuthController {
  static login = async (req: Request, res: Response) => {
    let userLogin = <User>req.body;

    let username: string = userLogin.username;
    let password: string = userLogin.password;

    if (!username) {
      return res.status(400).json({ message: "Vui lòng nhập tên tài khoản" });
    }

    if (!password) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu" });
    }

    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên tài khoản và mật khẩu" });
    }

    const user = getConnection()
      .get("users")
      .find({ username: username, password: password })
      .value();

    if (!user)
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng" });

    let accessToken = jwt.sign(
      { username: username, roles: user.roles },
      <string>process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: <string>process.env.ACCESS_TOKEN_LIFE,
      }
    );

    let refreshToken = jwt.sign(
      { username: username, roles: user.roles },
      <string>process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: <string>process.env.REFRESH_TOKEN_LIFE,
      }
    );
    user.refreshToken = refreshToken;
    getConnection()
      .get("users")
      .find({ username: username, password: password })
      .assign(user)
      .write();

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      accessToken,
      refreshToken,
      user,
    });
  };

  static register = async (req: Request, res: Response) => {
    const userRegister = <User>req.body;

    const user = getConnection()
      .get("users")
      .find({ username: userRegister.username })
      .value();

    if (user) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    } else {
      const newUser = <User>req.body;
      newUser.id = nanoid();
      if (!newUser.roles) {
        newUser.roles = ["user_role"];
      }
      try {
        getConnection().get("users").push(newUser).write();
        res.json(newUser);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  };

  static profile = (req: Request, res: Response) => {
    const data = getConnection().get("users").value();
    return res.json(data);
  };

  static refreshToken(req: Request, res: Response) {
    const refreshToken = <string>req.headers.x_authorization;
    if (!refreshToken) {
      return res.status(400).send("Không tìm thấy refresh token.");
    }

    let accessToken;

    console.log(
      <any>jwt.verify(refreshToken, <string>process.env.REFRESH_TOKEN_SECRET)
    );
    try {
      const user = <any>(
        jwt.verify(refreshToken, <string>process.env.REFRESH_TOKEN_SECRET)
      );
      if (!user) {
        return res.status(400).send("Access token không hợp lệ.");
      }

      accessToken = jwt.sign(
        {
          username: user.username,
          roles: user.roles,
        },
        <string>process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: <string>process.env.ACCESS_TOKEN_LIFE,
        }
      );
    } catch (error) {
      return res
        .status(400)
        .send("Tạo access token không thành công, vui lòng thử lại.");
    }

    if (!accessToken)
      return res
        .status(400)
        .send("Tạo access token không thành công, vui lòng thử lại.");
    return res.json({
      accessToken,
    });
  }
}

export default AuthController;
