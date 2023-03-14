import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuth = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessTokenFromHeader = <string>req.headers.x_authorization;
    if (!accessTokenFromHeader) {
      return res.status(401).send("Không tìm thấy access token!");
    }
    let verified;

    try {
      verified = <any>(
        jwt.verify(
          accessTokenFromHeader,
          <string>process.env.ACCESS_TOKEN_SECRET
        )
      );
    } catch (error) {
      return res.status(401).send("Access token không hợp lệ!");
    }

    if (!verified.roles.some((r: string) => roles.indexOf(r) >= 0)) {
      return res
        .status(403)
        .send("Bạn không có quyền truy cập vào tính năng này!");
    }

    next();
  };
};
