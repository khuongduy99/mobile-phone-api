import { nanoid } from "nanoid";
import { getConnection } from "../database";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../interfaces/user.interface";

class AuthController {
  static login = async (req: Request, res: Response) => {
    const userLogin = <User>req.body;
    const { username, password } = userLogin;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên tài khoản và mật khẩu" });
    }
    if (!username) {
      return res.status(400).json({ message: "Tên tài khoản là bắt buộc" });
    }

    if (!password) {
      return res.status(400).json({ message: "Mật khẩu là bắt buộc" });
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
    getConnection()
      .get("users")
      .find({ username: username, password: password })
      .assign(user)
      .write();

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      accessToken,
      user,
    });
  };

  static register = async (req: Request, res: Response) => {
    const userRegister = <User>req.body;
    const { username, password } = userRegister;

    if (!username) {
      return res.status(409).json({ message: "Tên tài khoản là bắt buộc" });
    } else {
      if (username.length < 5 || username.length > 100) {
        return res
          .status(409)
          .json({ message: "Tên tài khoản phải từ 5 -> 100 ký tự" });
      }
      if (/\s/.test(username)) {
        return res
          .status(400)
          .json({ message: "Tên tài khoản không được chứa khoảng trắng" });
      }
    }

    if (!password) {
      return res.status(409).json({ message: "Mật khẩu là bắt buộc" });
    } else {
      if (password.length < 6 || password.length > 100) {
        return res
          .status(409)
          .json({ message: "Mật khẩu phải từ 6 -> 100 ký tự" });
      }
    }

    const user = getConnection()
      .get("users")
      .find({ username: username })
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
}

export default AuthController;
